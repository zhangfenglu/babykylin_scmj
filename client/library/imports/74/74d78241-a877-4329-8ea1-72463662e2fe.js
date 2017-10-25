cc.Class({
    "extends": cc.Component,
    properties: {
        account: null,
        userId: null,
        userName: null,
        lv: 0,
        exp: 0,
        coins: 0,
        gems: 0,
        sign: 0,
        ip: "",
        sex: 0,
        roomData: null,

        oldRoomId: null
    },

    //随机生成 num 位 的随机数 含大小写字母及数字
    getRandomAccount: function getRandomAccount(num) {
        /**
         * 返回一个字母
         */
        function getCharacter(flag) {
            var character = "";
            if (flag === "lower") {
                character = String.fromCharCode(Math.floor(Math.random() * 26) + "a".charCodeAt(0));
            }
            if (flag === "upper") {
                character = String.fromCharCode(Math.floor(Math.random() * 26) + "A".charCodeAt(0));
            }
            return character;
        }

        var str = "";
        for (var i = 0; i < num; i++) {
            var flag = "lower";
            var random = Math.floor(Math.random() * 3);
            if (random == 0) {
                flag = "upper";
                str += getCharacter(flag);
            } else if (random == 1) {
                str += getCharacter(flag);
            } else {
                str += Math.floor(Math.random() * 10);
            }
        }
        return str;
    },

    guestAuth: function guestAuth() {
        var account = cc.args["account"];
        console.log("账号：" + account);
        if (account == null) {
            account = cc.sys.localStorage.getItem("account");
        }

        if (account == null) {
            //account = Date.now();
            account = this.getRandomAccount(8);
            console.log("账号：" + account);
            cc.sys.localStorage.setItem("account", account);
        }

        cc.vv.http.sendRequest("/guest", { account: account }, this.onAuth);
    },

    onAuth: function onAuth(ret) {
        var self = cc.vv.userMgr;
        if (ret.errcode !== 0) {
            console.log(ret.errmsg);
        } else {
            self.account = ret.account;
            self.sign = ret.sign;
            cc.vv.http.url = "http://" + cc.vv.SI.hall;
            self.login();
        }
    },

    login: function login() {
        var self = this;
        var onLogin = function onLogin(ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            } else {
                if (!ret.userid) {
                    //jump to register user info.
                    cc.director.loadScene("createrole");
                } else {
                    console.log(ret);
                    self.account = ret.account;
                    self.userId = ret.userid;
                    self.userName = ret.name;
                    self.lv = ret.lv;
                    self.exp = ret.exp;
                    self.coins = ret.coins;
                    self.gems = ret.gems;
                    self.roomData = ret.roomid;
                    self.sex = ret.sex;
                    self.ip = ret.ip;
                    cc.director.loadScene("hall");
                }
            }
        };
        cc.vv.wc.show("正在登录游戏");
        cc.vv.http.sendRequest("/login", { account: this.account, sign: this.sign }, onLogin);
    },

    create: function create(name) {
        var self = this;
        var onCreate = function onCreate(ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            } else {
                self.login();
            }
        };

        var data = {
            account: this.account,
            sign: this.sign,
            name: name
        };
        cc.vv.http.sendRequest("/create_user", data, onCreate);
    },

    enterRoom: function enterRoom(roomId, callback) {
        var self = this;
        var onEnter = function onEnter(ret) {
            if (ret.errcode !== 0) {
                if (ret.errcode == -1) {
                    setTimeout(function () {
                        self.enterRoom(roomId, callback);
                    }, 5000);
                } else {
                    cc.vv.wc.hide();
                    if (callback != null) {
                        callback(ret);
                    }
                }
            } else {
                cc.vv.wc.hide();
                if (callback != null) {
                    callback(ret);
                }
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            roomid: roomId
        };
        cc.vv.wc.show("正在进入房间 " + roomId);
        cc.vv.http.sendRequest("/enter_private_room", data, onEnter);
    },
    getHistoryList: function getHistoryList(callback) {
        var self = this;
        var onGet = function onGet(ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            } else {
                console.log(ret.history);
                if (callback != null) {
                    callback(ret.history);
                }
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign
        };
        cc.vv.http.sendRequest("/get_history_list", data, onGet);
    },
    getGamesOfRoom: function getGamesOfRoom(uuid, callback) {
        var self = this;
        var onGet = function onGet(ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            } else {
                console.log(ret.data);
                callback(ret.data);
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            uuid: uuid
        };
        cc.vv.http.sendRequest("/get_games_of_room", data, onGet);
    },

    getDetailOfGame: function getDetailOfGame(uuid, index, callback) {
        var self = this;
        var onGet = function onGet(ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            } else {
                console.log(ret.data);
                callback(ret.data);
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            uuid: uuid,
            index: index
        };
        cc.vv.http.sendRequest("/get_detail_of_game", data, onGet);
    }
});
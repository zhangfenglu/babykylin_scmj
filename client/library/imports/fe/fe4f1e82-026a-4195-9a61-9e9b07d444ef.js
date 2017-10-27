cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _userinfo: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (cc.vv == null) {
            return;
        }

        this._userinfo = cc.find("Canvas/userinfo");
        this._userinfo.active = false;
        cc.vv.utils.addClickEvent(this._userinfo, this.node, "UserInfoShow", "onClicked");

        cc.vv.userinfoShow = this;
    },

    show: function show(name, uid, iconSprite, sex, ip) {
        if (uid != null && uid > 0) {
            this._userinfo.active = true;
            this._userinfo.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = iconSprite.spriteFrame;
            this._userinfo.getChildByName("name").getComponent(cc.Label).string = name;
            this._userinfo.getChildByName("ip").getComponent(cc.Label).string = "IP: " + ip.replace("::ffff:", "");
            this._userinfo.getChildByName("id").getComponent(cc.Label).string = "ID: " + uid;

            var sex_female = this._userinfo.getChildByName("sex_female");
            sex_female.active = false;

            var sex_male = this._userinfo.getChildByName("sex_male");
            sex_male.active = false;

            if (sex == 1) {
                sex_male.active = true;
            } else if (sex == 2) {
                sex_female.active = true;
            }
        }
    },

    onClicked: function onClicked() {
        this._userinfo.active = false;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
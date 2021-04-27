<template>
    <div class="box">
        <img src="../../static/image/back.jpg" alt="">
        <div class="register">
            <div class="register_box">
                <div class="register-title">百知教育在线平台注册</div>
                <div class="inp">
                    <input v-model="phone" type="text" placeholder="手机号码" class="user" @blur="check_phone" >
                    <input  v-model="password" type="password" placeholder="登录密码" class="user" @blur="pwd">
                    <div id="geetest"></div>
                    <div class="sms-box">
                        <input  v-model="code" type="text" maxlength="6" placeholder="输入验证码" class="user" @blur="check_message">
                        <div  class="sms-btn" @click="get_code" >{{ code_txt }}}</div>
                    </div>

                    <button class="register_btn" @click="user_register">注册</button>
                    <p class="go_login">已有账号
                        <router-link to="/login">直接登录</router-link>
                    </p>
                </div>
            </div>
        </div>z
    </div>
</template>

<script>
export default {
    name: "Register",
    data() {
        return {
            sms: "",
            phone: "",
            password: "",
            is_send_sms: false,// 是否已经发送短信的状态
            sms_text: "点击发送短信", //发送短信的提示
            i: 60,
            code_txt : "获取验证码",
            code: "",

        }
    },
    methods: {
        check_phone() {
            let phone = this.phone;
            let pattern = /^1[356789]\d{9}$/;
            if (phone === null || phone === "") {
                this.$message.error("手机号不能为空")
            }else if (pattern.test(phone) === false) {
                this.$message.error("手机号格式有误")
            }
        },
        pwd() {
            let user_pwd = this.password;
            let pattern = /^.*(?=.{8,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
            if (user_pwd === null || user_pwd === "") {
                this.$message.error("密码不能为空")
            } else if (pattern.test(user_pwd) === false) {
                this.$message.error("密码格式有误")
            }
        },
        check_message() {
            let code = this.code;
            let pattern = /^\d{6}$/;
            if (code === null || code === "") {
                this.$message.error("验证码不能为空")
            } else if (pattern.test(user_pwd) === false) {
                this.$message.error("验证码格式有误")
            }
        },
        time60s(){
            this.i = this.i - 1;
            this.code_txt = this.i
            console.log(this.i)
            if (this.i === 0) {
                this.code_txt = '重新发送'
                this.i = 60;
                return;
            }
            clearTimeout(this.timer);  //清除延迟执行 */
            this.timer = setTimeout(()=>{   //设置延迟执行
                this.time60s()
            },1000);
        },
        //为用户发送验证码
        get_code(){
            // 验证手机号格式
            if(!/1[3-9]\d{9}/.test(this.phone)){
                this.$alert("手机号格式有误，请确认","警告");
                return false;
            }
            // 正确的话发送请求 获取验证码
            this.time60s()
            this.$axios({
                url: this.$settings.HOST+ "user/message/",
                method: 'get',
                params: {
                    phone : this.phone,
                    flag:1,

                }
            }).then(res=>{
                console.log(res.data)
                this.$message.success(res.data.msg)
            }).catch(error=>{
                console.log(error.response)
                console.log(error.response.data.msg)
                this.$message.error(error.response.data.msg)
            })

        },

        // 用户注册请求
        user_register() {
            this.$axios({
                url: this.$settings.HOST + "user/register/",
                method: "post",
                data:{
                    phone: this.phone,
                    password: this.password,
                    sms_code : this.code
                },
            }).then(res=>{
                // 保持登陆状态
                sessionStorage.token = res.data.token;
                sessionStorage.username = res.data.username;
                sessionStorage.id = res.data.id;
                // 页面跳转
                let self = this;
                this.$alert("注册成功", "柏芝教育",{
                    callback(){
                        self.$router.push("/home")
                    }
                })

            }).catch(error=>{
                console.log(error);
                this.$message.error("注册失败");
            })
        },
    }
}
</script>

<style scoped>
.box {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.box img {
    width: 100%;
    min-height: 100%;
}

.box .register {
    position: absolute;
    width: 500px;
    height: 400px;
    top: 0;
    left: 0;
    margin: auto;
    right: 0;
    bottom: 0;
    top: -338px;
}

.register .register-title {
    width: 100%;
    font-size: 24px;
    text-align: center;
    padding-top: 30px;
    padding-bottom: 30px;
    color: #4a4a4a;
    letter-spacing: .39px;
}

.register-title img {
    width: 190px;
    height: auto;
}

.register-title p {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #fff;
    letter-spacing: .29px;
    padding-top: 10px;
    padding-bottom: 50px;
}

.register_box {
    width: 400px;
    height: auto;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5);
    border-radius: 4px;
    margin: 0 auto;
    padding-bottom: 40px;
}

.register_box .title {
    font-size: 20px;
    color: #9b9b9b;
    letter-spacing: .32px;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-around;
    padding: 50px 60px 0 60px;
    margin-bottom: 20px;
    cursor: pointer;
}

.register_box .title span:nth-of-type(1) {
    color: #4a4a4a;
    border-bottom: 2px solid #84cc39;
}

.inp {
    width: 350px;
    margin: 0 auto;
}

.inp input {
    border: 0;
    outline: 0;
    width: 100%;
    height: 45px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    text-indent: 20px;
    font-size: 14px;
    background: #fff !important;
}

.inp input.user {
    margin-bottom: 16px;
}

.inp .rember {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-top: 10px;
}

.inp .rember p:first-of-type {
    font-size: 12px;
    color: #4a4a4a;
    letter-spacing: .19px;
    margin-left: 22px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    /*position: relative;*/
}

.inp .rember p:nth-of-type(2) {
    font-size: 14px;
    color: #9b9b9b;
    letter-spacing: .19px;
    cursor: pointer;
}

.inp .rember input {
    outline: 0;
    width: 30px;
    height: 45px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    text-indent: 20px;
    font-size: 14px;
    background: #fff !important;
}

.inp .rember p span {
    display: inline-block;
    font-size: 12px;
    width: 100px;
    /*position: absolute;*/
    /*left: 20px;*/

}

#geetest {
    margin-top: 20px;
}

.register_btn {
    width: 100%;
    height: 45px;
    background: #84cc39;
    border-radius: 5px;
    font-size: 16px;
    color: #fff;
    letter-spacing: .26px;
    margin-top: 30px;
}

.inp .go_login {
    text-align: center;
    font-size: 14px;
    color: #9b9b9b;
    letter-spacing: .26px;
    padding-top: 20px;
}

.inp .go_login span {
    color: #84cc39;
    cursor: pointer;
}

.sms-box {
    position: relative;
}

.sms-btn {
    font-size: 14px;
    color: #ffc210;
    letter-spacing: .26px;
    position: absolute;
    right: 16px;
    top: 10px;
    cursor: pointer;
    overflow: hidden;
    background: #fff;
    border-left: 1px solid #484848;
    padding-left: 16px;
    padding-bottom: 4px;
}
</style>

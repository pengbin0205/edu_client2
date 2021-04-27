<template>
    <div class="login box">
        <img src="../../static/image/back.jpg" alt="">
        <div class="login">
            <div class="login-title">
                <img src="../../static/image/logo.png" alt="">
                <p>百知教育给你最优质的学习体验!</p>
            </div>
            <div class="login_box">
                <div class="title">
                    <span @click="flag2=0">密码登录</span>
                    <span @click="flag2=1">短信登录</span>
                </div>
<!--                <div class="inp" v-if="">-->
<!--                    <input v-model="account"  type="text" placeholder="用户名 / 手机号码 / 邮箱" class="user">-->
<!--                    <input v-model="password" type="password" name="" class="pwd" placeholder="密码">-->
<!--                    <div id="geetest1"></div>-->
<!--                    <div class="rember">-->
<!--                        <p>-->
<!--                            <input type="checkbox" class="no"  v-model="remember"/>-->
<!--                            <span>记住密码</span>-->
<!--                        </p>-->
<!--                        <p>忘记密码</p>-->
<!--                    </div>-->
<!--                    <button class="login_btn btn btn-primary" @click="get_captcha">登录</button>-->
<!--                    <p class="go_login">没有账号-->
<!--                        <router-link to="/register">立即注册</router-link>-->
<!--                    </p>-->
<!--                </div>-->
<!--                <div class="inp" v-show="">-->
<!--                    <input type="text" placeholder="手机号码" class="user">-->
<!--                    <input type="text" class="pwd" placeholder="短信验证码">-->
<!--                    <button id="get_code" class="btn btn-primary">获取验证码</button>-->
<!--                    <button class="login_btn" >登录</button>-->
<!--                    <span class="go_login">没有账号-->
<!--                        <router-link to="/register">立即注册</router-link>-->
<!--                    </span>-->
<!--                </div>-->
                <div class="inp" v-show="flag2===0">
                    <input type="text" v-model="username" placeholder="用户名 / 手机号码" class="user" @blur="check_username">
                    <input type="password"  v-model="password" name="" class="pwd" placeholder="密码" @blur="pwd">
                    <div id="geetest1"></div>
                    <div class="rember" >
                        <p>
                            <input type="checkbox" class="no" v-model="rember"/>
                            <span>记住密码</span>
                        </p>
                        <router-link to="/check_pwd"><p>忘记密码</p></router-link>
                    </div>
                    <button class="login_btn btn btn-primary" @click="get_captcha">登录</button>
                    <p class="go_login">没有账号
                        <router-link to="/register">立即注册</router-link>
                    </p>
                </div>
                <div class="inp" v-show="flag2===1">
                    <input type="text" placeholder="手机号码" class="user" v-model="phone" @blur="check_phone">
                    <input type="text" class="pwd" placeholder="短信验证码" v-model="code" @blur="check_message">
                    <button id="get_code" class="btn btn-primary" @click="get_code">{{ code_text }}</button>
                    <button class="login_btn" @click="user_login2">登录</button>
                    <span class="go_login">没有账号
                        <router-link to="/register">立即注册</router-link>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return{
                // account: "",
                // password: "",
                // remember: false,
                username:'',
                password:'',
                phone:"",
                token:'',
                code:"",
                rember:false,
                flag2:0,
                code_text:"发送验证码",
                i:60,
            }
        },
        created() {
            //判断是否在local里有
            if(localStorage.username){
                this.username = localStorage.username;
                this.password = localStorage.password;
                this.remember = true;
            }
        },


        methods: {
            user_login(){
                this.$axios({
                    url:this.$settings.HOST + "user/login/",
                    method:"post",
                    data:{
                        username:this.username,
                        password:this.password
                    }
                }).then(res=>{
                    console.log(res.data);
                    let token = res.data.token;
                    if (token){
                        this.$message({
                            message: "登陆成功",
                            type: "success",
                            duration: 1000,
                            showClose: true
                        })

                        //将用户数据储存起来，方便展示
                        sessionStorage.username = res.data.username;
                        sessionStorage.token = res.data.token;
                        sessionStorage.user_id = res.data.user_id;
                        // 记住密码
                        if(this.rember){
                            localStorage.username = this.username
                            localStorage.password = this.password
                        }else {
                            localStorage.removeItem('username');
                            localStorage.removeItem('password');
                        }
                        // 跳转到首页
                        this.$router.push("/home");
                    }
                }).catch(error=>{
                    console.log(error);
                    this.$message.error("用户名或密码错误");
                })
            },
            user_login2(){
                this.$axios({
                    url:this.$settings.HOST + "user/login2/",
                    method:"post",
                    data:{
                        phone:this.phone,
                        sms_code:this.code,
                    }
                }).then(res=>{
                    console.log(res.data);
                    sessionStorage.username = res.data.username;
                    sessionStorage.token = res.data.token;
                    sessionStorage.id = res.data.user_id;
                    this.$message({
                        message:"登录成功",
                        type:"success",
                        duration:1000,
                        showClose:true
                    })
                    this.$router.push("/home")
                }).catch(error=>{
                    console.log(error);
                    this.$message.error(error.response.data.msg);
                })
            },
            time60s(){
                this.i = this.i - 1;
                this.code_text = this.i
                console.log(this.i)
                if (this.i === 0) {
                    this.code_text = '重新发送'
                    this.i = 60;
                    return;
                }
                clearTimeout(this.timer);  //清除延迟执行 */
                this.timer = setTimeout(()=>{   //设置延迟执行
                    this.time60s()
                },1000);
            },
            check_username() {
                let username = this.name;
                if (username === null || username === "") {
                    this.$message.error("用户名不能为空")
                }
            },
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
                } else if (pattern.test(code) === false) {
                    this.$message.error("验证码格式有误")
                }
            },
            get_code(){
                if(!/1[3-9]\d{9}/.test(this.phone)){
                    this.$alert("手机号格式有误，请确认","警告");
                    return false;
                }
                this.time60s()
                this.$axios({
                    url:this.$settings.HOST + "user/message/",
                    method:'get',
                    params:{
                        phone:this.phone,
                        flag:0,
                    }
                }).then(res=>{
                    console.log(res.data)
                    this.$message.success("登录成功")
                }).catch(error=>{
                    console.log(error.response)
                    this.$message.error("登录失败")
                })
            },
            // 点击登录按钮  获取验证码
            get_captcha() {
                this.$axios({
                    url: this.$settings.HOST + "user/captcha/",
                    method: 'get',
                    params: {
                        username: this.username
                    }
                }).then(res => {
                    let data = JSON.parse(res.data);
                    // 获取challenge成功后在前端生成验证码
                    // 使用initGeetest接口
                    // 参数1：配置参数
                    // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
                    initGeetest({
                        gt: data.gt,
                        challenge: data.challenge,
                        product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                        offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                        new_captcha: data.new_captcha
                    }, this.handlerPopup);

                }).catch(error => {
                    console.log(error);
                })
            },

            // 获取验证码的回调函数  完成验证码验证的
            handlerPopup(captchaObj) {
                let self = this;
                captchaObj.onSuccess(function () {
                    // 获取验证码对象
                    let validate = captchaObj.getValidate();
                    // 当用户滑动滑块后会发送请求校验结果
                    self.$axios({
                        url: self.$settings.HOST + "user/captcha/",
                        method: "post",
                        data: {
                            account: self.account,
                            // password: $('#password1').val(),
                            geetest_challenge: validate.geetest_challenge,
                            geetest_validate: validate.geetest_validate,
                            geetest_seccode: validate.geetest_seccode
                        },
                    }).then(res => {
                        // 验证码校验通过则完成登录
                        self.user_login()

                    }).catch(error => {
                        console.log(error);
                    })
                });
                // 在显示验证码之前先将div置为空
                document.getElementById("geetest1").innerHTML = "";
                // 显示验证码
                captchaObj.appendTo("#geetest1");
            },
            },

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

.box .login {
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

.login .login-title {
    width: 100%;
    text-align: center;
}

.login-title img {
    width: 190px;
    height: auto;
}

.login-title p {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #fff;
    letter-spacing: .29px;
    padding-top: 10px;
    padding-bottom: 50px;
}

.login_box {
    width: 400px;
    height: auto;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5);
    border-radius: 4px;
    margin: 0 auto;
    padding-bottom: 40px;
}

.login_box .title {
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

.login_box .title span:nth-of-type(1) {
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

.login_btn {
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
</style>

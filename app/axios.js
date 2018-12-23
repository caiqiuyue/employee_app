import ajax from 'axios';

//请求域名头
const urlTitle = 'https://www.fangapo.cn/api';



const clientApi = (type, url, data, resolve, reject) => {
    //console.log(global);
    //首先判断global里面有没有tokenKey
    if(global.tokenKey) {
        //console.log(global.tokenKey,'global.tokenKey');
        //如果有则直接传入data
        data.tokenKey = global.tokenKey;
        //发送Ajax
        ajax[type](`${urlTitle}${url}`, data).then(
            (response) => {
                if(response.data.code == 2) {

                    console.log(response,'response');

                    alert('登陆过期，请重新登陆');
                    storage.remove({
                        key: 'tokenKey'
                    });
                    storage.remove({
                        key: 'username'
                    });
                    clearInterval(global.stopMsgTime);
                    global.tokenKey='';
                    global.getNavigate('Login',{ user: '' })
                } else {
                    resolve(response);
                }
            }
        ).catch(
            (error) => {
                reject(error);
            }
        );
    } else {
        //如果没有则从本地storage中读取
        storage.load({ //读取tokenKey
            key: 'tokenKey',
            autoSync: false
        }).then(ret => {
            //成功获取tokenKey并将其存入global
            global.tokenKey = ret.tokenKey;
            data.tokenKey = ret.tokenKey;
            console.log(ret.tokenKey,"ret.tokenKey");
            //发送Ajax
            ajax[type](`${urlTitle}${url}`, data).then(
                (response) => {
                    if(response.data.code == 2) {
                        console.log(response,'response');
                        alert('登陆过期，请重新登陆');
                        storage.remove({
                            key: 'tokenKey'
                        });
                        storage.remove({
                            key: 'username'
                        });
                        clearInterval(global.stopMsgTime);
                        global.tokenKey='';
                        global.getNavigate('Login',{ user: '' })
                    } else {
                        resolve(response);
                    }
                }
            ).catch(
                (error) => {
                    reject(error);
                }
            );
        }).catch(err => {
            //如果获取不到tokenKey，则代表用户还未登入
            ajax[type](`${urlTitle}${url}`, data).then(
                (response) => {
                    if(response.data.code == 2) {
                        console.log(response,'response');
                        alert('登陆过期，请重新登陆');
                        storage.remove({
                            key: 'tokenKey'
                        });
                        storage.remove({
                            key: 'username'
                        });
                        clearInterval(global.stopMsgTime);
                        global.tokenKey='';
                        global.getNavigate('Login',{ user: '' })
                    } else {
                        resolve(response);
                    }
                }
            ).catch(
                (error) => {
                    reject(error);
                }
            );
        });

    }


}


//post请求
const post = (url, data) => {
    return new Promise((resolve, reject) => clientApi('post', url, data, resolve, reject));
};

//get请求
const get = () => {
    return new Promise((resolve, reject) => clientApi('get', url, data, resolve, reject));
};

//封装请求方法
const axios = {
    post,
    get
}

//暴露方法
export default axios;


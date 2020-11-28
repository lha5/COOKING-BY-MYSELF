import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

function KakaoLogin(props) {
    const kakaoUser = useRef();
    const [Cookies, setCookie] = useCookies(['w_auth', 'w_authExp']);

    useEffect(() => {
        window.Kakao.Auth.createLoginButton({
            container: '#kakao-login-button',
            success: () => {
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: (res) => {
                        kakaoUser.current = res;
                        goKakaoLogin();
                    },
                    fail: (error) => {
                        console.log(error);
                    }
                });
            },
            fail: (err) => {
                console.log(err);
            },
            scope: 'account_email'
        });
    }, []);

    const goKakaoLogin = () => {
        axios.post('http://localhost:5000/api/user/kakao', {'kakaoUser': kakaoUser})
            .then(response => {
                if (response.data.loginSuccess) {
                    localStorage.setItem('userId', response.data.userId);
                    setCookie('w_auth', response.data.w_auth);
                    setCookie('w_authExp', response.data.w_authExp);
                    console.log('카카오 사용자 정보 처리 완료');
                    window.location.replace('/');
                }
            });
    };

    return (
        <div>
            <div id="kakao-login-button" />
        </div>
    );
}

export default KakaoLogin;
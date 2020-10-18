import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "../../../_actions/user_actions";
import Swal from 'sweetalert2';

function UserSection(props) {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const confirmLogout = () => {
        Swal.fire({
            title: '로그아웃 하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '로그아웃'
        }).then(result => {
            if (result.isConfirmed) {
                onLogout();
            }
        });
    };

    const onLogout = () => {
        const provider = user.userData.provider;

        if (provider === 1) {
            if (!window.Kakao.Auth.getAccessToken()) {
                console.log('카카오 계정에 로그인되어 있지 않습니다.');
                return;
            }
            window.Kakao.Auth.logout(() => {
                console.log('토큰 만료 확인 : ', window.Kakao.Auth.getAccessToken());
            });
        }

        setTimeout(() => {
            dispatch(logoutUser())
                .then(response => {
                    if (response.payload === 200) {
                        window.localStorage.removeItem('userId');
                        window.location.replace('/');
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: '로그아웃 실패:('
                        });
                    }
                });
        }, 500);
    };

    if (user.userData && !user.userData.isAuth) {
        return (
            <div className="userMenu">
                <Link to="/signin">
                    <button className="login">
                        로그인
                    </button>
                </Link>
            </div>
        );
    } else {
        return (
            <div className="userMenu">
                <button className="login" onClick={confirmLogout}>
                    로그아웃
                </button>
            </div>
        );
    }
}

export default withRouter(UserSection);
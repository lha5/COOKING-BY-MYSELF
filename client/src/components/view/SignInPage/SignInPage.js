import React from 'react';
import Swal from 'sweetalert2';
import { signinUser } from '../../../_actions/user_actions';
import '../../../assets/css/signInPage.scss';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import KakaoLogin from './KakaoLogin';

function SignInPage(props) {
    const dispatch = useDispatch();

    const { errors, handleSubmit, register } = useForm({ mode: 'onSubmit' });

    const onSubmit = data => {
        setTimeout(() => {
            const dataToSubmit = {
                email: data.email,
                password: data.password
            };

            dispatch(signinUser(dataToSubmit))
                .then(response => {
                    if (response.payload.loginSuccess) {
                        localStorage.setItem('userId', response.payload.userId);
                        props.history.push('/');
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "이메일 또는 비밀번호를 확인하세요."
                        });
                    }
                });
        }, 500);
    };

    return (
        <div className="signUpForm">
            <div className="pageTitle">로그인</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="eachSection">
                    <div className="labelContainer">
                        <label htmlFor="text">이메일</label>
                    </div>
                    <input
                        name="email"
                        type="text"
                        ref={register({
                            required: '이메일을 입력하세요'
                        })}
                    />
                    { errors.email && <p className="formError">{ errors.email.message }</p> }
                </div><div className="eachSection">
                    <div className="labelContainer">
                        <label htmlFor="password">비밀번호</label>
                    </div>
                    <input
                        name="password"
                        type="password"
                        ref={register({
                            required: '비밀번호를 입력하세요.'
                        })}
                    />
                    { errors.password && <div className="formError">{ errors.password.message }</div> }
                </div>
                <input type="submit" value="로그인" className="login" />
            </form>

            <div className="signUpSection">
                <div className="guideTitle"> 또는 </div>
                <KakaoLogin />
            </div>

            <div className="signUpSection">
                <div className="guideTitle">아직 회원이 아니신가요?</div>
                <Link to='/signup'>
                    <button className="goSignUp">회원 가입 하러 가기</button>
                </Link>
            </div>
        </div>
    );
}

export default SignInPage;
import React, { useState }  from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import moment from 'moment';
import Swal from 'sweetalert2';

import { checkEmail, signupUser } from '../../../_actions/user_actions';
import '../../../assets/css/signUpPage.scss';

function SignUpPage(props) {
    const dispatch = useDispatch();

    const [ checkEmailResult, setCheckEmailResult ] = useState(true);

    const { errors, register, handleSubmit, getValues } = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        shouldFocusError: true
    });

    const onCheckEmailDup = async (value) => {
        let typedEmail = { email: value };
        let result = false;

        await dispatch(checkEmail(typedEmail))
            .then(response => {
                if (response.payload === false) {
                    result = false;
                } else {
                    result = true;
                }
            });

        setCheckEmailResult(result);
    };

    const onSubmit = data => {
        setTimeout(() => {
            let dataToSubmit = {
                email: data.email,
                name: data.name,
                password: data.password,
                image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
            };

            dispatch(signupUser(dataToSubmit))
                .then(response => {
                    if (response.payload.success) {
                        Swal.fire({
                            icon: "success",
                            title: "회원 가입을 환영합니다!"
                        });
                        props.history.push('/');
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "회원 가입을 할 수 없습니다."
                        });
                    }
                });
        }, 500);
    };

    return (
        <div className="signUpForm">
            <div className="pageTitle">회원 가입</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="eachSection">
                    <div className="labelContainer">
                        <label htmlFor="email">이메일</label>
                    </div>
                    <input
                        name="email"
                        type="email"
                        ref={register({
                            required: "이메일은 필수 입력 항목입니다.",
                            validate: {
                                emailFormat: value => isEmail(value) || "올바른 이메일 형식이 아닙니다.",
                                emailDup: value => onCheckEmailDup(value)
                            }
                        })}
                    />
                    { errors.email && <p className="formError">{ errors.email.message }</p> }
                    { checkEmailResult ? null : <div className="formError">이미 사용 중인 이메일 입니다.</div> }
                </div>
                <div className="eachSection">
                    <div className="labelContainer">
                        <label htmlFor="text">이름</label>
                    </div>
                    <input
                        name="name"
                        type="text"
                        ref={register({
                            required: "이름은 필수 입력 항목입니다.",
                            minLength: {
                                value: 2,
                                message: '이름은 두 글자 이상 입력하세요.'
                            }
                        })}
                    />
                    { errors.name && <div className="formError">{ errors.name.message }</div> }
                </div>
                <div className="eachSection">
                    <div className="labelContainer">
                        <label htmlFor="password">비밀번호</label>
                    </div>
                    <input
                        name="password"
                        type="password"
                        ref={register({
                            required: "비밀번호는 필수 입력 항목입니다.",
                            minLength: {
                                value: 8,
                                message: '비밀번호는 여덟 자 이상 입력하세요.'
                            }
                        })}
                    />
                    { errors.password && <div className="formError">{ errors.password.message }</div> }
                </div>
                <div className="eachSection">
                    <div className="labelContainer">
                        <label htmlFor="password">비밀번호 확인</label>
                    </div>
                    <input
                        name="confirm"
                        type="password"
                        ref={register({
                            required: "비밀번호 확인은 필수 입력 항목입니다.",
                            validate: value => (value === getValues('password')) || '비밀번호가 일치하지 않습니다.'
                        })}
                    />
                    { errors.confirm && <div className="formError">{ errors.confirm.message }</div> }
                </div>
                <input type="submit" value="회원 가입" className="signUpButton" />
            </form>
        </div>
    );
}

export default SignUpPage;
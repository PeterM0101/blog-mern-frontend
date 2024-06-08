import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegistration, selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";

export const Registration = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);

    const {
        handleSubmit,
        // setError,
        register,
        formState: {errors, isValid}
    } =
        useForm(
            {
                defaultValues: {
                    email: '',
                    password: '',
                    fullName: ''
                },
                mode: "onTouched"
            },
        )

    if (isAuth) return <Navigate to={'/'} />

    async function onSubmit(data) {
        const res = await dispatch(fetchRegistration(data));
        if (!res.payload) return alert('Authentication error!');
        if ('token' in res.payload) {
            window.localStorage.setItem('token', res.payload.token)
        }
    }

    return (
        <Paper classes={{root: styles.root}}>
            <Typography classes={{root: styles.title}} variant="h5">
                Создание аккаунта
            </Typography>
            <div className={styles.avatar}>
                <Avatar sx={{width: 100, height: 100}}/>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="Полное имя"
                    error={Boolean(errors.fullName?.message)}
                    helperText={errors.fullName?.message}
                    fullWidth
                    {...register('fullName', {required: 'This field is required'})}
                />
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    fullWidth
                    {...register('email', {required: 'This field is required'})}
                />
                <TextField
                    className={styles.field}
                    label="Пароль"
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    fullWidth
                    {...register('password', {required: 'This field is required'})}
                />
                <Button size="large" variant="contained" fullWidth type={'submit'} disabled={!isValid}>
                    Зарегистрироваться
                </Button>
            </form>
        </Paper>
    );
};

import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";

export const Login = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);

    const {
        handleSubmit,
        // setError,
        register,
        formState: { errors}
    } =
        useForm(
            {
                defaultValues: {email: '', password: ''},
                mode: "onSubmit"
            },
        )

    async function onSubmit(data) {
        const res = await dispatch(fetchAuth(data));
        if (!res.payload) return alert('Authentication error!');
        if ('token' in res.payload) {
            window.localStorage.setItem('token', res.payload.token)
        }
    }

    if (isAuth) return <Navigate to={'/'} />

    return (

        <Paper classes={{root: styles.root}}>
            <Typography classes={{root: styles.title}} variant="h5">
                Вход в аккаунт
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    fullWidth
                    {...register("email", {required: 'This field is required'})}
                />
                <TextField
                    className={styles.field}
                    label="Пароль"
                    helperText={errors.password?.message}
                    error={Boolean(errors.password?.message)}
                    fullWidth
                    {...register("password", {required: 'This field is required'})}
                />
                <Button size="large" variant="contained" fullWidth type={"submit"}>
                    Войти
                </Button>
            </form>
        </Paper>
    )
        ;
};

import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import { Navigate, useMatch, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import axios from "../../axios";
import Skeleton from "@mui/material/Skeleton";

export const AddPost = () => {
    const isAuth = useSelector(selectIsAuth);
    const inputRef = useRef(null);
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const isEdit = !!useMatch('/posts/:id/edit');
    const {id} = useParams();

    useEffect(onInit, []);

    function onInit() {
        if (isEdit && id) void getPost();
    }

    const handleChangeFile = async (event, onChange) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);
            const {data} = await axios.post('/upload', formData)
            onChange(data.url);
        } catch (error) {
            console.error(error.message)
        }
    };

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        [],
    );

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        register,
        formState: {errors}
    } =
        useForm(
            {
                defaultValues: {text: '', title: '', tags: '', imageUrl: ''},
                mode: "onSubmit"
            },
        )

    const imageUrl = watch('imageUrl');
    async function getPost() {
        try {
            const res = await axios.get(`/posts/${id}`);
            console.log('Res1: ', res.data)
            if (res?.data?.text) setValue('text', res.data.text);
            if (res?.data?.title) setValue('title', res.data.title);
            if (res?.data?.imageUrl) setValue('imageUrl', res.data.imageUrl.replace('http://localhost:4444/', ''));
            if (res?.data?.tags) setValue('tags', res.data.tags.join(','));
        } catch (e) {
            console.error(e)
        }
    }

    async function onSubmit(data) {
        setIsLoading(true)
        data.imageUrl = `http://localhost:4444/${data.imageUrl}`
        try {
            if (isEdit) {
                await axios.patch(`/posts/${id}`, data);
                navigate(`/posts/${id}`)
            } else {
                const res = await axios.post('/posts', data);
                navigate(`/posts/${res.data._id}`)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    if (!isAuth) return <Navigate to={'/'}/>
    if (isLoading) return <Skeleton/>

    return (
        <Paper style={{padding: 30}}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name={'imageUrl'}
                    control={control}
                    render={({field, fieldState}) => (
                        <>
                            <Button variant="outlined" size="large" onClick={() => {
                                inputRef.current.click();
                            }}>
                                Загрузить превью
                            </Button>
                            <input type="file" onChange={(event) => handleChangeFile(event, field.onChange)} hidden
                                   ref={inputRef}/>
                            {imageUrl && (
                                <>
                                    <Button variant="contained" color="error" onClick={() => {
                                        setValue('imageUrl', '')
                                    }}>
                                        Удалить
                                    </Button>
                                    <img className={styles.image} src={`http://localhost:4444/${imageUrl}`}
                                         alt="Uploaded"/>
                                </>
                            )}
                        </>
                    )}
                />
                <br/>
                <br/>
                <TextField
                    classes={{root: styles.title}}
                    variant="standard"
                    placeholder="Заголовок статьи..."
                    error={Boolean(errors.title?.message)}
                    helperText={errors.title?.message}
                    fullWidth
                    {...register("title", {required: 'This field is required'})}
                />
                <TextField
                    classes={{root: styles.tags}}
                    variant="standard"
                    placeholder="Тэги"
                    // error={Boolean(errors.tags?.message)}
                    // helperText={errors.tags?.message}
                    fullWidth
                    {...register("tags")}
                />
                <Controller name={`text`}
                            control={control}
                            render={({field, fieldState}) => (
                                <SimpleMDE
                                    className={styles.editor}
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={options}
                                />
                            )}
                />
                <div className={styles.buttons}>
                    <Button size="large" variant="contained" type={'submit'}>
                        {isEdit ? 'Update' : 'Опубликовать'}
                    </Button>
                    <a href="/">
                        <Button size="large">Отмена</Button>
                    </a>
                </div>
            </form>
        </Paper>
    );
};

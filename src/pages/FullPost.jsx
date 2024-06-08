import React, { useEffect, useState } from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import moment from 'moment';
import axios from "../axios";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";

export const FullPost = () => {

    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true)
    const auth = useSelector(state => state.auth)
    const {id} = useParams()
    useEffect(onInit, []);

    console.log("data: ", data)

    function onInit() {
        axios.get(`posts/${id}`).then(res => {
            setData(res.data)
        }).catch(error => {
            console.error(error.message)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    console.log(data)
    if (isLoading) return <Post isLoading isFullPost/>

    return (
        <>
            <Post
                id={data._id}
                title={data.title}
                imageUrl={data.imageUrl}
                user={{
                    avatarUrl: auth.data.avatarUrl,
                    fullName: auth.data.fullName,
                }}
                createdAt={moment(data.createdAt).format('DD MMMM YYYY')}
                viewsCount={data.viewsCount}
                commentsCount={3}
                tags={data.tags}
                isFullPost
            >
                <ReactMarkdown children={data.text} />
            </Post>
            <CommentsBlock
                items={[
                    {
                        user: {
                            fullName: "Вася Пупкин",
                            avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                        },
                        text: "Это тестовый комментарий 555555",
                    },
                    {
                        user: {
                            fullName: "Иван Иванов",
                            avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                        },
                        text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
                    },
                ]}
                isLoading={false}
            >
                <Index/>
            </CommentsBlock>
        </>
    );
};

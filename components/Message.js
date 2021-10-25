import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { useSelector } from 'react-redux';
function Message({ user, message }) {
    const router = useRouter();
    const [userLoggedIn] = useAuthState(auth);
    const [seen, setSeen] = useState();
    const [first, setFirst] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [temp, setTemp] = useState('');
    const { darkTheme } = useSelector((state) => ({ ...state }));
    const [chatSnapshot] = useCollection(
        db.collection('chat').doc(router.query.id)
    );
    useEffect(() => {
        setSeen(chatSnapshot?.data().seen);
    }, [chatSnapshot]);
    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;
    return (
        <Conatiner>
            {isOpen && (
                <Lightbox
                    mainSrc={temp}
                    onCloseRequest={() => setIsOpen(false)}
                />
            )}{' '}
            <TypeOfMessage
                style={{
                    background: message.message.includes('?alt')
                        ? 'transaprent'
                        : user === userLoggedIn.email
                        ? '#dcf8c6'
                        : 'whitesmoke',
                }}
            >
                {message?.message && message.message.includes('?alt') ? (
                    <SendedImg
                        className="img"
                        onClick={() => {
                            setTemp(message.message);
                            setIsOpen(true);
                        }}
                        style={{
                            transform:
                                user === userLoggedIn.email
                                    ? 'translateX(4.5rem) translateY(0.8rem)'
                                    : 'translateX(-0.6rem) ',
                        }}
                        src={message.message}
                        alt=""
                    />
                ) : (
                    message?.message
                )}
                <Time
                    style={{
                        transform:
                            user === userLoggedIn.email
                                ? 'translateX(-0.5rem) '
                                : message.message.includes('?alt') &&
                                  'translateX(-4.2rem) translateY(-0.8rem)',
                    }}
                >
                    {' '}
                    {message.timestamp
                        ? moment(message.timestamp).format('LT')
                        : '...'}
                </Time>{' '}
                {user === userLoggedIn.email && (
                    <Seen
                        style={{
                            transform:
                                user === userLoggedIn.email &&
                                'translateX(-0.5rem) ',
                        }}
                    >
                        {seen ? (
                            <svg viewBox="0 0 16 15" width="16" height="15">
                                <path
                                    fill="#61caf1"
                                    d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                                ></path>
                            </svg>
                        ) : (
                            <>
                                {' '}
                                <svg viewBox="0 0 16 15" width="16" height="15">
                                    <path
                                        fill="#c8c8c8"
                                        d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                                    ></path>
                                </svg>
                            </>
                        )}
                    </Seen>
                )}
                {/*user === userLoggedIn.email && (
                    <Tick>
                        <svg viewBox="0 0 8 13" width="12" height="16">
                            <path
                                opacity=".13"
                                d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"
                            ></path>
                            <path
                                fill="#dcf8c6"
                                d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"
                            ></path>
                        </svg>
                    </Tick>
                )*/}
            </TypeOfMessage>
        </Conatiner>
    );
}

export default Message;

const Conatiner = styled.div``;
const Seen = styled.div`
    position: absolute;
    right: 5px;
    bottom: 0;
`;
const MessageElement = styled.p`
    width: fit-content;
    position: relative;
    padding-right: 4.7rem;
    padding-left: 0.8rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom-left-radius: 8px;
    border-top-left-radius: 8px;
    border-bottom-right-radius: 8px;
    margin: 10px;
    min-width: 60px;
    position: relative;
    text-align: left;
    z-index: 1;
    line-height: 20px;
    @media (max-width: 868px) {
        font-size: 14px;
    }
`;
const Sender = styled(MessageElement)`
    margin-left: auto;
    //background-color: #fff;
    position: relative;
`;
const Receiver = styled(MessageElement)`
    text-align: left;
    // background-color: whitesmoke;
    position: relative;
    border-top-right-radius: 8px;
`;

const Time = styled.span`
    color: gray;
    padding: 10px;
    font-size: 9px;
    position: absolute;
    bottom: -5px;
    text-align: right;
    right: 1rem;
`;
const Tick = styled.div`
    position: absolute;
    right: -11px;
    top: -1px;
    z-index: -1;
`;
const SendedImg = styled.img`
    width: 400px;
    height: 100%;
    border-radius: 6px;
    border: 3px solid white;
    box-shadow: 0 1px 0.5px rgba(255, 255, 255, 0.13);
    cursor: pointer;
    @media (max-width: 868px) {
        width: 300px;
    }

    @media (max-width: 568px) {
        width: 250px;
    }
    @media (max-width: 468px) {
        width: 150px;
    }
`;

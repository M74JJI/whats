import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
import getReceivingEmail from '../utils/getReceivingEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TimeAgo from 'timeago-react';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
function Chat({ id, users }) {
    const gray = useRef();
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [messages, setMessages] = useState([]);
    const [time, setTime] = useState([]);
    const [seen, setSeen] = useState(false);
    const [to, setTo] = useState();
    const [selected, setSelected] = useState(false);
    const [chatSnapshot] = useCollection(db.collection('chat').doc(id));
    const { darkTheme } = useSelector((state) => ({ ...state }));

    const [messagesSnapshot] = useCollection(
        db
            .collection('chat')
            .doc(id)
            .collection('messages')
            .orderBy('timestamp', 'asc')
    );
    useEffect(() => {
        if (id === router.query.id) {
            setSelected(true);
        } else {
            setSelected(false);
        }
    }, [router.query.id]);
    useEffect(() => {
        messagesSnapshot?.docs.map((message) => {
            setMessages(message.data().message);
            setTime(message.data().timestamp?.toDate().getTime());
        });
        setSeen(chatSnapshot?.data().seen);
        setTo(chatSnapshot?.data().to);
    }, [messagesSnapshot, chatSnapshot]);

    const [receivingSnapshot] = useCollection(
        db
            .collection('users')
            .where('email', '==', getReceivingEmail(users, user))
    );
    const EnterChat = () => {
        if (to === user.email) {
            db.collection('chat').doc(id).set(
                {
                    seen: true,
                },
                { merge: true }
            );
        }

        router.push(`/chat/${id}`);
    };

    const receiving = receivingSnapshot?.docs?.[0]?.data();
    const receivingEmail = getReceivingEmail(users, user);

    return (
        <Container
            onClick={EnterChat}
            ref={gray}
            style={{
                background:
                    selected && darkTheme
                        ? '#323739'
                        : selected
                        ? '#ebebeb'
                        : '',
                borderColor: darkTheme && '#30383d',
            }}
            onMouseEnter={() => {
                darkTheme
                    ? gray.current.classList.add('gray')
                    : gray.current.classList.add('light');
            }}
            onMouseLeave={() => {
                darkTheme
                    ? gray.current.classList.remove('gray')
                    : gray.current.classList.remove('light');
            }}
        >
            {receiving ? (
                <UserAvatar src={receiving?.photoURL} />
            ) : (
                <UserAvatar src="https://chatwasap.com/assets/img/default-avatar.png" />
            )}
            <div className="hide">
                <ChatWrap>
                    <p>{receivingEmail}</p>

                    <Flex style={{ transform: 'translateY(-1rem' }}>
                        <Seen>
                            {seen ? (
                                <svg viewBox="0 0 16 15" width="16" height="15">
                                    <path
                                        fill="#61caf1"
                                        d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                                    ></path>
                                </svg>
                            ) : (
                                <svg viewBox="0 0 16 15" width="16" height="15">
                                    <path
                                        fill="#c8c8c8"
                                        d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                                    ></path>
                                </svg>
                            )}
                        </Seen>
                        {messages && messages.includes('?alt') ? (
                            <Photo>
                                <PhotoIcon src="/photo.svg" alt="" />{' '}
                                <span>Photo</span>
                            </Photo>
                        ) : messages.length > 25 ? (
                            <span>{messages.substring(0, 23)}...</span>
                        ) : (
                            <span>{messages}</span>
                        )}
                    </Flex>
                </ChatWrap>

                <Ago>
                    <TimeAgo datetime={time} />
                </Ago>
            </div>
        </Container>
    );
}

export default Chat;

const Container = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;
    height: 72px;
    pointer-events: all;

    border-bottom: 1px solid whitesmoke;
`;
const ChatWrap = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
        font-weight: 600;
    }
    span {
        word-break: break-all;
    }
`;
const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
    transform: scale(1.3);
`;
const Ago = styled.div`
    position: absolute;
    right: 5px;
    bottom: 15px;
    font-size: 12px;
`;
const Seen = styled.div`
    transform: translateY(4px);
    margin-right: 5px;
`;
const Photo = styled.div`
    display: flex;
    align-items: center;
    column-gap: 5px;
    span {
        font-size: 14px;
        line-height: 16px;
    }
`;
const PhotoIcon = styled.img`
    width: 15px;
    height: 16px;
`;
const Flex = styled.div`
    display: flex;
    align-items: center;
`;

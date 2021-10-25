import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { Avatar } from '@material-ui/core';
import { auth, db, storage } from '../firebase';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { IconButton } from '@material-ui/core';
import firebase from 'firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useEffect, useState } from 'react';
import getReceivingEmail from '../utils/getReceivingEmail';
import TimeAgo from 'timeago-react';
import { useRef } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import dynamic from 'next/dynamic';
const Picker = dynamic(() => import('emoji-picker-react'), {
    ssr: false,
});

import 'emoji-mart/css/emoji-mart.css';
import CloseIcon from '@material-ui/icons/close';
import { useSelector } from 'react-redux';
function ChatScreen({ chat, messages }) {
    const filePickerRef = useRef(null);
    const endOfMsg = useRef(null);
    const inputfield = useRef(null);
    const [user] = useAuthState(auth);
    const [selectedFile, setSelectedFile] = useState(null);
    const [file, setFile] = useState(null);
    const [url, setURL] = useState('');
    const router = useRouter();
    const [input, setInput] = useState('');
    const [emoji, setEmoji] = useState(null);
    const [cursorPosition, setCursorPosition] = useState();
    const [showEmojis, setShowEmojis] = useState(false);
    const [first, setFirst] = useState(false);
    const [to, setTo] = useState();
    const { darkTheme } = useSelector((state) => ({ ...state }));
    const [chatSnapshot] = useCollection(
        db.collection('chat').doc(router.query.id)
    );
    const [messagesSnapshot] = useCollection(
        db
            .collection('chat')
            .doc(router.query.id)
            .collection('messages')
            .orderBy('timestamp', 'asc')
    );
    const [recipientSnapshot] = useCollection(
        db
            .collection('users')
            .where('email', '==', getReceivingEmail(chat.users, user))
    );
    const addImageToPost = (e) => {
        setFile(e.target.files[0]);
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result);
        };
    };
    console.log('url', url);
    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map((message) => (
                <Message
                    key={message.id}
                    user={message.user}
                    message={message}
                />
            ));
        }
    };
    useEffect(() => {
        inputfield.current.focus();
        setTo(chatSnapshot?.data().to);
        if (to === user.email) {
            db.collection('chat').doc(router.query.id).set(
                {
                    seen: true,
                },
                { merge: true }
            );
        }
    }, [chatSnapshot]);
    const scrollBtm = () => {
        endOfMsg.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };
    useEffect(() => {
        inputfield.current.selectionEnd = cursorPosition;
    }, [cursorPosition]);
    const sendMessage = (e) => {
        const receivingEmail = getReceivingEmail(chat.users, user);
        e.preventDefault();
        db.collection('users').doc(user.uid).set(
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
        db.collection('chat').doc(router.query.id).set(
            {
                seen: false,
                to: receivingEmail,
            },
            { merge: true }
        );
        db.collection('chat').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });
        setInput('');
        scrollBtm();
    };
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const ReceivingEmail = getReceivingEmail(chat.users, user);
    const handleEmoji = (e, { emoji }) => {
        const ref = inputfield.current;
        ref.focus();
        const start = input.substring(0, ref.selectionStart);
        const end = input.substring(ref.selectionStart);
        const text = start + emoji + end;
        setInput(text);
        setCursorPosition(start.length + emoji.length);
    };

    function handleSubmit(e) {
        e.preventDefault();
        const ref = storage.ref(`/images/${file.name}`);
        const uploadTask = ref.put(file);
        uploadTask.on('state_changed', console.log, console.error, () => {
            ref.getDownloadURL().then((url) => {
                setFile(null);
                setURL(url);
                db.collection('chat')
                    .doc(router.query.id)
                    .collection('messages')
                    .add({
                        timestamp:
                            firebase.firestore.FieldValue.serverTimestamp(),
                        message: url,
                        user: user.email,
                        photoURL: user.photoURL,
                    });
            });
        });
    }

    return (
        <Container>
            <Header
                style={{
                    background: darkTheme && '#2a2f32',
                    color: darkTheme && 'white',
                    border: darkTheme && 'none',
                }}
            >
                {recipient ? (
                    <Avatar src={recipient?.photoURL} />
                ) : (
                    <Avatar src="https://chatwasap.com/assets/img/default-avatar.png"></Avatar>
                )}
                <HeaderInfos className="hInfos">
                    <h3>{ReceivingEmail}</h3>
                    {recipientSnapshot ? (
                        <p
                            style={{
                                color: darkTheme && 'white',
                            }}
                        >
                            last seen :{''}{' '}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo
                                    datetime={recipient?.lastSeen?.toDate()}
                                />
                            ) : (
                                'unavailable'
                            )}
                        </p>
                    ) : (
                        <p>loading...</p>
                    )}
                </HeaderInfos>
                <HeaderIcons className="hide">
                    <IconButton onClick={() => filePickerRef.current.click()}>
                        <AttachFileIcon
                            style={{
                                color: darkTheme && 'white',
                            }}
                        />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon
                            style={{
                                color: darkTheme && 'white',
                            }}
                        />
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                <Background
                    className="bg"
                    style={{
                        backgroundImage:
                            darkTheme && 'url(' + '../bg.png' + ')',
                        opacity: darkTheme && '1',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'repeat',
                    }}
                ></Background>
                {showMessages()}
                <EndOfMessage ref={endOfMsg} />
            </MessageContainer>
            {file && (
                <ShowCase>
                    <CloseIconn
                        onClick={() => {
                            setSelectedFile(null);
                            setFile(null);
                        }}
                    />
                    <img src={selectedFile} />
                    <SendImg onClick={handleSubmit}>
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path
                                fill="#fff"
                                d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"
                            ></path>
                        </svg>
                    </SendImg>
                </ShowCase>
            )}
            <InputContainer
                onSubmit={sendMessage}
                style={{
                    background: darkTheme && '#2a2f32',
                    color: darkTheme && 'white',
                }}
            >
                <Emoji>
                    {showEmojis ? (
                        <div
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                inputfield.current.focus();
                                setShowEmojis(!showEmojis);
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path
                                    fill={darkTheme ? 'white' : '#51585c'}
                                    d="M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z"
                                ></path>
                            </svg>
                        </div>
                    ) : (
                        <div
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                inputfield.current.focus();
                                setShowEmojis(!showEmojis);
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="26" height="42">
                                <path
                                    fill={darkTheme ? 'white' : '#51585c'}
                                    d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"
                                ></path>
                            </svg>
                        </div>
                    )}
                    <input
                        type="file"
                        hidden
                        ref={filePickerRef}
                        onChange={addImageToPost}
                    />
                    <div onClick={() => filePickerRef.current.click()}>
                        <svg viewBox="0 0 24 24" width="26" height="42">
                            <path
                                fill={darkTheme ? 'white' : '#51585c'}
                                d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"
                            ></path>
                        </svg>
                    </div>

                    <EmojiPicker>
                        {showEmojis && (
                            <PickerCustomed onEmojiClick={handleEmoji} />
                        )}
                    </EmojiPicker>
                </Emoji>
                <Input
                    style={{
                        background: darkTheme && '#323739',
                        color: darkTheme && 'white',
                    }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    ref={inputfield}
                    placeholder="Type a message"
                />
                <button
                    hidden
                    disabled={!input}
                    type="submit"
                    onClick={sendMessage}
                >
                    Send
                </button>
                <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="hide"
                >
                    <path
                        fill={darkTheme ? 'white' : '#51585c'}
                        d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"
                    ></path>
                </svg>
            </InputContainer>
        </Container>
    );
}

export default ChatScreen;

const Container = styled.div`
    position: relative;
`;
const Header = styled.div`
    position: sticky;
    background-color: #eeeeee;
    z-index: 100;
    top: 0;
    display: flex;
    align-items: center;
    padding: 11px;
    border-bottom: 1px solid whitesmoke;
    height: 80px;
`;
const HeaderInfos = styled.div`
    margin-left: 15px;
    flex: 1;
    > h3 {
        margin-bottom: 3px;
    }
    > p {
        font-size: 14px;
        color: gray;
    }
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
    position: relative;
    padding: 30px;
    min-height: 90vh;
    overflow: hidden;
    @media (max-width: 868px) {
        padding: 0;
    }
`;
const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;
const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: #f0f0f0;
    z-index: 1;
`;
const Input = styled.input`
    flex: 1;
    border: none;
    padding: 12px 0;
    padding-left: 1rem;
    margin: 0 15px;
    background-color: white;
    z-index: 100;
    outline: 0;
    border: none;
    min-height: 20px;
    max-height: 100px;
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 15px;
    font-weight: 400;
    word-wrap: break-word;
    white-space: pre-wrap;
    border-radius: 50px;
`;
const Emoji = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    column-gap: 10px;
`;
const EmojiPicker = styled.div`
    position: absolute;
    bottom: 3rem;
    z-index: 999;
`;

const PickerCustomed = styled(Picker)`
    width: 1500px;
`;

const Modal = styled.div``;
const ShowCase = styled.div`
    width: 1000px;
    height: 84.4%;
    position: fixed;
    top: 5rem;
    left: 400px;
    z-index: 989999;
    background-color: #e6e6e6;
    overflow: hidden;
    img {
        object-fit: contain;
        width: 1000px;
        height: 84.4%;
    }
`;
const SendImg = styled.div`
    width: 60px;
    height: 60px;
    padding: 0;
    background-color: #09e85e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    position: absolute;
    right: 2rem;
    cursor: pointer;
    transition: all 0.2s;
    :hover {
        transform: scale(1.1);
    }
`;
const Background = styled.div`
    background-image: url('https://theabbie.github.io/blog/assets/official-whatsapp-background-image.jpg');
    background-repeat: repeat;
    background-color: #e5ddd5;
    opacity: 0.1;
    position: fixed;
    top: 0;
    left: 300px;
    height: 100%;
    width: 1081px;
    z-index: -1;
    @media (max-width: 868px) {
        left: 0;
    }
`;
const CloseIconn = styled(CloseIcon)`
    cursor: pointer;
    margin: 5px;
`;

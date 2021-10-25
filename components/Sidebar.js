import styled from 'styled-components';
import { Avatar, Button, IconButton } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';
import getReceivingEmail from '../utils/getReceivingEmail';
import { useState } from 'react';
import CloseIcon from '@material-ui/icons/close';

import { MdDarkMode } from 'react-icons/md';
import { FiSun } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
function Sidebar() {
    const dispatch = useDispatch();
    const [user] = useAuthState(auth);
    const [users, setUsers] = useState();
    const [show, setShow] = useState(false);
    const [showMenu, setShowMenu] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const { darkTheme } = useSelector((state) => ({ ...state }));

    const userChatRef = db
        .collection('chat')
        .where('users', 'array-contains', user.email);
    const [chatsSnapshot] = useCollection(userChatRef);
    const createChat = () => {
        if (!email) return;
        if (
            EmailValidator.validate(email) &&
            !chatAlreadyExist(email) &&
            email !== user.email
        ) {
            db.collection('chat').add({
                users: [user.email, email],
                seen: false,
            });
        }
        setShow(false);
    };
    const chatAlreadyExist = (Remail) =>
        !!chatsSnapshot?.docs.find(
            (chat) =>
                chat.data().users.find((user) => user === Remail)?.length > 0
        );

    return (
        <Wrapper>
            {showMenu && (
                <Container
                    className="conx"
                    style={{
                        background: darkTheme && '#222f37',
                        color: darkTheme && 'white',
                    }}
                >
                    {show && (
                        <AddContact>
                            <Close onClick={() => setShow(false)} />
                            <Title>Add Contact</Title>

                            <InputEmail
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <ButtonSubmit onClick={createChat}>
                                Add
                            </ButtonSubmit>
                        </AddContact>
                    )}
                    <Header
                        style={{
                            background: darkTheme && '#2a2f32',
                            color: darkTheme && 'white',
                        }}
                    >
                        <UserAvatar
                            src={user.photoURL}
                            onClick={() => {
                                auth.signOut();
                            }}
                        />
                        <IconsContainer>
                            {darkTheme === false ? (
                                <IconButton
                                    onClick={() => {
                                        dispatch({
                                            type: 'SWITCH_THEME',
                                            payload: true,
                                        });
                                    }}
                                >
                                    <MdDarkMode />
                                </IconButton>
                            ) : (
                                <IconButton
                                    onClick={() =>
                                        dispatch({
                                            type: 'SWITCH_THEME',
                                            payload: false,
                                        })
                                    }
                                >
                                    <FiSun
                                        style={{
                                            background: darkTheme && '#222f37',
                                            color: darkTheme && 'white',
                                        }}
                                    />
                                </IconButton>
                            )}

                            <IconButton>
                                <div className="hide">
                                    <ChatIcon
                                        style={{
                                            background: darkTheme && '#222f37',
                                            fill: darkTheme && 'white',
                                        }}
                                    />
                                </div>
                            </IconButton>
                            <IconButton>
                                <div className="hide">
                                    <MoreVertIcon
                                        style={{
                                            background: darkTheme && '#222f37',
                                            fill: darkTheme && 'white',
                                        }}
                                    />
                                </div>
                            </IconButton>
                        </IconsContainer>
                    </Header>
                    <Search style={{ background: darkTheme && '#222f37' }}>
                        <div className="hide">
                            <SearchWrap
                                style={{ background: darkTheme && '#323739' }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    color="#51585c"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.808 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"
                                    ></path>
                                </svg>
                                <SearchInput
                                    style={{
                                        background: darkTheme && '#323739',
                                        color: darkTheme && 'white',
                                    }}
                                    placeholder="Search or start new chat"
                                />
                            </SearchWrap>
                        </div>
                        <StartNewChat
                            style={{
                                border: darkTheme && 'none',
                                color: darkTheme && 'white',
                            }}
                            onClick={() => setShow(true)}
                        >
                            <b>+</b>
                        </StartNewChat>
                    </Search>

                    {/* contacts*/}
                    <ChatWrap>
                        {chatsSnapshot?.docs.map((chat) => (
                            <Chat
                                key={chat.id}
                                id={chat.id}
                                users={chat.data().users}
                            />
                        ))}
                    </ChatWrap>
                </Container>
            )}
        </Wrapper>
    );
}

export default Sidebar;
const Wrapper = styled.div`
    display: flex;
`;
const ChatWrap = styled.div`
    overflow-y: auto;
    height: calc(79.6vh - 2rem);
    position: relative;
`;
const Container = styled.div`
    flex: 0.45;
    background-color: white;

    height: calc(100vh - 2rem);

    position: relative;
`;
const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
    background-color: #f6f6f6;
    position: sticky;
    top: 5rem;
    z-index: 1;
`;
const SearchWrap = styled.div`
    background-color: white;
    display: flex;
    align-items: center;
    flex: 1;
    padding: 5px;
    border-radius: 20px;
`;
const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
    padding-left: 10px;
`;
const StartNewChat = styled(Button)`
    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
    b {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #00af9c;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: #fff;
    }
`;
const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: #eeeeee;
    z-index: 1;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    height: 80px;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div``;
const AddContact = styled.div`
    position: absolute;
    left: 100%;
    top: 17%;
    display: flex;
    flex-direction: column;
    text-align: center;
    row-gap: 1rem;
    z-index: 999;
    background: url('https://www.metronews.co.za/wp-content/uploads/2019/05/WhatsApp-white-logo-on-green-background.jpg');
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    background-size: cover;

    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 1rem 3rem;
    height: 300px;
    width: 300px;
    transition: all 0.2s;
    animation-name: a7a;
    animation-duration: 0.5s;
    transition-origin: left;
    color: #fff;
    @media (max-width: 768px) {
        width: 230px;
        height: 230px;
        left: 30%;
    }

    @keyframes a7a {
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }
    input {
        border: none;
        outline: none;
        border-radius: 5px;
        height: 30px;
    }
    button {
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
    }
`;
//onClick={createChat}
const Title = styled.h2``;
const Close = styled(CloseIcon)`
    position: absolute;
    left: 1rem;
    cursor: pointer;
`;
const ButtonSubmit = styled.button`
    padding: 0.5rem 0;
    border: none;
`;
const InputEmail = styled.input`
    padding-left: 1rem;
`;
const HideShow = styled.div`
    font-size: 10px;
    display: none;
`;

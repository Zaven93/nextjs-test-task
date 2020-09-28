import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography, Breadcrumbs, Link, TextField, Drawer, Dialog } from '@material-ui/core'
import {
    NotificationsNone,
    Edit,
    AlternateEmail,
    Phone,
    Close,
    AssignmentInd
} from '@material-ui/icons'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const phoneRegex = RegExp(
    /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/gm
)

const Index = () => {
    const [edit, setEdit] = useState(false)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [editedUserData, setEditedUserData] = useState({
        fullName: '',
        email: '',
        phoneNumber: ''
    })

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
    }

    const screenSize = useWindowSize()

    const sendPost = async () => {
        try {
            const response = await axios({
                url: 'http://jsonplaceholder.typicode.com/posts',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token-access': 'random'
                },
                data: {
                    userId: 13,
                    id: 13,
                    title: 'Some test title',
                    body: 'Some test body'
                }
            })

            console.log('Data from the server', response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (localStorage.getItem('userData')) {
            setEditedUserData({ ...JSON.parse(localStorage.getItem('userData')) })
        }
    }, [edit])

    const { fullName, email, phoneNumber } = editedUserData

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            phoneNumber: ''
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Name is required'),
            email: Yup.string().email('Please type in a valid email').required('Email is required'),
            phoneNumber: Yup.string()
                .matches(phoneRegex, 'Invalid phone')
                .required('Phone is required')
        }),
        onSubmit: (values) => {
            localStorage.setItem('userData', JSON.stringify(values))
            setOpenDrawer(false)
            setEdit(false)
            sendPost()
        }
    })

    return (
        <div className="main-container">
            <div className="profile">
                <NotificationsNone className="notification-icon" />
                <span className="divider"></span>
                <img className="user-profile" src="/img/user.svg" alt="user-profile" />
                {screenSize.width > 767 ? (
                    <p>
                        {editedUserData.fullName.split(' ')[0]}{' '}
                        {editedUserData.fullName.split(' ')[1].charAt(0)}.
                    </p>
                ) : (
                    ''
                )}
            </div>
            <div className="profile-heading">
                <h1>ЛИЧНЫЙ ПРОФИЛЬ</h1>
                <p>Главная/Личный профиль</p>{' '}
                {/*This one could have been implemented with breadcrumbs but I didn't see any sense at this point */}
            </div>
            <div className="profile-info">
                <img className="user-profile" src="/img/user.svg" alt="user-profile" />
                <p>{fullName ? fullName : 'Иванова Анна Михайловна'}</p>
                {edit ? (
                    <Close
                        style={{ color: '#ffffff', fontSize: 25, marginLeft: 'auto' }}
                        onClick={() => setEdit(false)}
                    />
                ) : (
                    <>
                        {screenSize.width > 767 && <p className="reduce">РЕДАКТИРОВАТЬ</p>}
                        <Edit
                            className="edit-icon"
                            style={{ color: '#ffffff', fontSize: 25 }}
                            onClick={() => setEdit(true)}
                        />
                    </>
                )}
            </div>
            {edit ? (
                <div className="edit-profile-data">
                    <form>
                        <div className="form-subcontainer">
                            <div className="form-group">
                                {screenSize.width > 990 && <AssignmentInd />}
                                <div className="form-control">
                                    <TextField
                                        error={
                                            formik.touched.fullName && formik.errors.fullName
                                                ? true
                                                : false
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.firstName}
                                        name="fullName"
                                        size="medium"
                                        id="outlined-basic"
                                        label="Фамилия и имя"
                                        variant="outlined"
                                    />
                                    {formik.touched.fullName && formik.errors.fullName ? (
                                        <div className="error-notification">
                                            {formik.errors.fullName}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="form-group">
                                {screenSize.width > 990 && <AlternateEmail />}
                                <div className="form-control">
                                    <TextField
                                        error={
                                            formik.touched.email && formik.errors.email
                                                ? true
                                                : false
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.firstName}
                                        name="email"
                                        size="medium"
                                        id="outlined-basic"
                                        label="E-mail"
                                        variant="outlined"
                                    />
                                    {formik.touched.email && formik.errors.email ? (
                                        <div className="error-notification">
                                            {formik.errors.email}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="form-group">
                                {screenSize.width > 990 && <Phone />}
                                <div className="form-control">
                                    <TextField
                                        error={
                                            formik.touched.phoneNumber && formik.errors.phoneNumber
                                                ? true
                                                : false
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.firstName}
                                        name="phoneNumber"
                                        size="medium"
                                        id="outlined-basic"
                                        label="Номер телефона"
                                        variant="outlined"
                                    />
                                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                        <div className="error-notification">
                                            {formik.errors.phoneNumber}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                setOpenDrawer(true)
                            }}>
                            Сохранить изменения
                        </button>
                    </form>
                </div>
            ) : (
                <div className="profile-contact-info">
                    <span>
                        <AlternateEmail style={{ color: '#00BFA5' }} />
                        <p>{email ? email : 'ivanova@mail.ru'}</p>
                    </span>
                    <span>
                        <Phone style={{ color: '#00BFA5' }} />
                        <p>{phoneNumber ? phoneNumber : 'Укажите номер телефона'}</p>
                    </span>
                </div>
            )}
            {screenSize.width < 767 ? (
                <Drawer anchor="bottom" open={openDrawer} onClose={() => setOpenDrawer(false)}>
                    <div className="drawer-data">
                        <Close
                            className="close-button"
                            style={{ color: '#828282', fontSize: 25 }}
                            onClick={() => setOpenDrawer(false)}
                        />
                        <h1>Сохранить изменения?</h1>
                        <button
                            onClick={() => {
                                formik.handleSubmit()
                            }}>
                            Сохранить
                        </button>
                        <button onClick={() => setOpenDrawer(false)}>Не сохранять</button>
                    </div>
                </Drawer>
            ) : (
                <Dialog open={openDrawer} onClose={() => setOpenDrawer(false)}>
                    <div className="drawer-data">
                        <Close
                            className="close-button"
                            style={{ color: '#828282', fontSize: 25 }}
                            onClick={() => setOpenDrawer(false)}
                        />
                        <h1>Сохранить изменения?</h1>
                        <button
                            onClick={() => {
                                formik.handleSubmit()
                            }}>
                            Сохранить
                        </button>
                        <button onClick={() => setOpenDrawer(false)}>Не сохранять</button>
                    </div>
                </Dialog>
            )}
        </div>
    )
}

// Hook
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined
    })

    useEffect(() => {
        // only execute all the code below in client side
        if (typeof window !== 'undefined') {
            // Handler to call on window resize
            function handleResize() {
                // Set window width/height to state
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight
                })
            }

            // Add event listener
            window.addEventListener('resize', handleResize)

            // Call handler right away so state gets updated with initial window size
            handleResize()

            // Remove event listener on cleanup
            return () => window.removeEventListener('resize', handleResize)
        }
    }, []) // Empty array ensures that effect is only run on mount
    return windowSize
}

export default Index

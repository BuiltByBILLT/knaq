import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { UserContext } from '../contexts/UserContext'
import { useMutation } from 'react-query'
import axios from 'axios'
import UploadPhotoModal from './UploadPhotoModal'
import ComingSoon from './ComingSoon'

const NewPost = ({ refetchFree, refetchSub }) => {

    const user = useContext(UserContext)
    const [write, setWrite] = useState(false);
    const [postText, setPostText] = useState("");
    const [checked, setChecked] = useState(false);

    const [showPicture, setShowPicture] = useState(false);
    const [cropUrl, setCropUrl] = useState("")
    const [cropBlob, setCropBlob] = useState("")
    const [pictureArray, setPictureArray] = useState([])


    const URL = "https://api.knaqapp.com/api"
    const { mutate, isLoading, reset } = useMutation(() => {
        const formData = new FormData()
        formData.append('text', postText)
        formData.append('subOnly', true)
        pictureArray.forEach(pic => formData.append('image', pic.blob))
        return axios.post(`${URL}/post/publish`, formData,
            { headers: { Authorization: `Bearer ${user.token}` } }
        )
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setWrite(``)
            setPostText(``)
            setChecked(false)
            setPictureArray([])
            reset()
            refetchFree()
            refetchSub()
        },
    })

    const postHandler = () => {
        mutate(postText)
    }

    const myForm = useRef();
    useEffect(() => {
        if (write) myForm.current.focus()
    }, [write]);

    useEffect(() => {
        if (!showPicture && cropUrl) {
            setPictureArray([...pictureArray, { url: cropUrl, blob: cropBlob }])
            setCropUrl("")
            setCropBlob("")
        }
    }, [showPicture])



    return (
        <div className="mt-3">
            <UploadPhotoModal show={showPicture} setShow={setShowPicture}
                setCropUrl={setCropUrl} setCropBlob={setCropBlob} cropType="square"
            />
            <Row className="pt-2 border-bottom">
                <Col xs="auto" className="pr-0">
                    <img src={user.avatarUrl || "/images/Logo.png"}
                        style={{ height: "30px", width: "30px", borderRadius: "100%" }}
                    />
                </Col>

                <Col className="mr-2">
                    {write && <Form.Control as="textarea" rows={3} value={postText} ref={myForm}
                        onChange={(e) => setPostText(e.target.value)}
                    ></Form.Control>}
                    {!write && <p onClick={() => setWrite(true)} className="text-muted mb-4">What's Happening?</p>}

                    {pictureArray.length > 0 &&
                        <Form.Row >
                            {pictureArray.map(pic => (
                                <Col xs={3} key={pic.url} className="mt-3">
                                    <div
                                        style={{
                                            paddingBottom: "100%", width: "100%", borderRadius: "5px", margin: "none",
                                            backgroundImage: `url(${pic.url})`,
                                            backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => setPictureArray(pictureArray.filter(item => item.url !== pic.url))}
                                    />
                                </Col>
                            ))}
                            {pictureArray.length < 10 && <Col xs={3} className="mt-3">
                                <div style={{ width: "100%", paddingBottom: "100%" }}>
                                    <div style={{
                                        position: "absolute", top: "0", width: "calc(100% - 10px)", height: "100%",
                                        border: "2px dashed #AFAFAF", borderRadius: "5px", backgroundColor: "#F4F4F4",
                                        color: "#AFAFAF"
                                    }}
                                        className="d-flex flex-column align-items-center justify-content-center"
                                        onClick={() => setShowPicture(true)}
                                    >
                                        <i className="fas fa-plus my-2" />Add Photo
                                    </div>
                                </div>
                            </Col>}
                        </Form.Row>
                    }

                    <Row className="ml-0 my-3">
                        {pictureArray.length === 0 &&
                            <>
                                <Col xs="auto" className="px-1 my-auto ">
                                    <i className="far fa-image fa-lg" style={{ cursor: "pointer" }}
                                        onClick={() => setShowPicture(true)}></i>
                                </Col>
                                <Col xs="auto" className="px-1 my-auto">
                                    <i className="fas fa-video fa-lg"></i>
                                </Col>
                            </>
                        }

                        <Col xs="auto" className="px-1 my-auto ml-auto">
                            <p className="mb-0">Sub-Only</p>
                        </Col>

                        <ComingSoon direction='bottom'>
                            <Col xs="auto" className="px-1 my-auto">
                                <div>
                                    <Form.Check
                                        type="switch"
                                        id="subonlyCheck"
                                        checked={checked}
                                        onChange={(e) => setChecked(!checked)}
                                        disabled
                                    />
                                </div>
                            </Col>
                        </ComingSoon>
                        <Col xs="auto" className="border-left">
                            <Button size="sm"
                                disabled={postText.length === 0 || isLoading}
                                onClick={postHandler}
                            >{isLoading ? "Posting..." : "Post"}</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>





        </div>
    )
}

export default NewPost

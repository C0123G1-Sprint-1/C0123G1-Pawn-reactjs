import {ErrorMessage, Field, Form, Formik} from "formik";
import * as customerService from "../../service/CustomerSaveService";
import {checkCitizenCodeExists, checkEmailExists, checkPhoneNumberExists} from "../../service/CustomerSaveService";
import * as Yup from "yup";
import {useNavigate} from "react-router";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../firebase";
import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";
import {Link} from "react-router-dom";
import "../customer/style-customer-save.css";
import {ThreeCircles} from "react-loader-spinner";

export function CreateCustomer() {

    let navigate = useNavigate();
    const [avatar, setAvatarFile] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [frontCitizen, setFrontCitizenFile] = useState(null);
    const [frontCitizenUrl, setFrontCitizenUrl] = useState(null);
    const [backCitizen, setBackCitizenFile] = useState(null);
    const [backCitizenUrl, setBackCitizenUrl] = useState(null);
    const [fileSelected, setFileSelected] = useState(false);
    const messageError = "Ảnh không được để trống!!";
    const [responseText, setResponseText] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [registerPawn, setRegisterPawn] = useState(null);
    const [cus, setCusPawn] = useState([]);

    const [initValues, setInitValues] = useState(
        {
            name: "",
            birthday: "",
            gender: "",
            phoneNumber: "",
            email: "",
            address: "",
            citizenCode: "",
            image: "",
            frontCitizen: "",
            backCitizen: "",
        }
    );


    useEffect(() => {
        const fetchData = async () => {
            try {
                const rs = await customerService.findAllRegisterPawn();
                setCusPawn(rs);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [phoneNumber]);

    const findRegisterPawnByPhoneNumber = (phoneNumber) => {
        // setName(cus.find((c) => c.phone == phoneNumber)?.name)
        console.log("cus-2", cus)
        return cus?.find((item) => item.phone === phoneNumber);
    };

    const handleGetInfoClick = async (e) => {
        const foundRegisterPawn = await findRegisterPawnByPhoneNumber(phoneNumber);
        console.log("Tìm có ", foundRegisterPawn)
        setRegisterPawn(foundRegisterPawn);
        if (foundRegisterPawn) {
            setInitValues({
                name: foundRegisterPawn?.name,
                phoneNumber: foundRegisterPawn?.phone,
                email: foundRegisterPawn?.email,
                address: foundRegisterPawn?.address,
                citizenCode: '',
            });
            Swal.fire({
                position: 'center',
                icon: "success",
                title: "Tìm thông tin thành công.",
                text: "Khách hàng " + foundRegisterPawn.name,
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Thất bại',
                text: 'Không tìm thấy dữ liệu',
                timer: 1500,
            });
        }
    };


    const handleFileSelect = (event, setFile, setFileUrl) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
        }
    };

    const handleFileUpload = async (file, setFile, setFileUrl) => {
        return new Promise((resolve, reject) => {
            if (!file) return reject("No file selected");
            const newName = "pawn_shop_topvn" + Date.now() + "_" + (file.name.length >= 5 ? file.name.slice(0, 5) : file.name);

            const storageRef = ref(storage, `files/${newName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setFile(downloadURL);
                    resolve(downloadURL);
                }
            );
        });
    };

    const handleAvatarFileSelect = (event) => {
        handleFileSelect(event, setAvatarFile, setAvatarUrl);
    };

    const handleFrontCitizenFileSelect = (event) => {
        handleFileSelect(event, setFrontCitizenFile, setFrontCitizenUrl);
    };

    const handleBackCitizenFileSelect = (event) => {
        handleFileSelect(event, setBackCitizenFile, setBackCitizenUrl);
    };

    const handleAvatarFileUpload = async () => {
        return handleFileUpload(avatar, setAvatarUrl);
    };
    const handleFrontCitizenFileUpload = async () => {
        return handleFileUpload(frontCitizen, setFrontCitizenUrl);
    };

    const handleBackCitizenFileUpload = async () => {
        return handleFileUpload(backCitizen, setBackCitizenUrl);
    };

    const getMinDate = () => {
        const today = new Date();
        return new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
        );
    };
    const getMaxDate = () => {
        const today = new Date();
        return new Date(
            today.getFullYear() - 100,
            today.getMonth(),
            today.getDate()
        );
    };

     const transformData = (data) => {
        const formatName = (name) => {
            return name
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        };

        const formatAddress = (address) => {
            return address
                .split(', ')
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                .join(', ');
        };

        const name = formatName(data.name);
        const dob = data.dob.split('/').reverse().join('-');
        const sex = data.sex === 'NAM' ? 0 : 1;
        const address = formatAddress(data.address);

        return {
            name,
            dob,
            sex,
            address,
        };
    };

    const handleSubmitScanOcr = async () => {
        if (!frontCitizen) {
            await Swal.fire({
                icon: 'error',
                title: 'Bạn cần upload Ảnh mặt trước căn cước.',
                timer: 1500,
            });
            return;
        }

        const url = 'https://api.fpt.ai/vision/idr/vnm';
        const apiKey = 'm13aY7m758e1ejzmiSfs3BxyIYcHy1T8';

        const formData = new FormData();
        formData.append('image', frontCitizen);

        const headers = {
            'api-key': apiKey,
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData,
            });

            const data = await response.json();
            console.log(data.data[0])
            const transformedData = transformData(data.data[0]);
            setInitValues({
                name: transformedData.name,
                birthday: transformedData.dob,
                gender: transformedData.sex,
                address: transformedData.address,
                citizenCode: data.data[0].id,
            });
        }

catch
    (error)
    {
            console.error('Error:', error);
            await Swal.fire({
            icon: 'error',
            title: 'Gặp sự cố với server.',
            text: 'Hãy thử lại sau ít phút.',
            timer: 1500,
            });
        }
    };

    return (
        <>
            <Formik
            initialValues={initValues} enableReinitialize
                validationSchema={Yup.object({
                    name: Yup.string().required("Tên không được để trống")
                        .min(5, 'Ký tự phải nhiều hơn 5')
                        .max(100, 'Ký tự phải ít hơn 100')
                        .matches(/^[\p{Lu}\p{Ll}\p{N}\s]+$/u, "Tên sản phẩm không được chứa ký tự đặc biệt")
                        .test('first-letter-capitalized', 'Chữ đầu tiên của tên sản phẩm phải viết hoa', value => {
                            const firstLetter = value.charAt(0);
                            return firstLetter === firstLetter.toUpperCase();
                        })
                        .test('no-special-characters', 'Tên sản phẩm không được chứa các ký tự đặc biệt như @, #, !', value => {
                            return !/[!@#\$%\^&*()_\+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
                        }),

                    birthday: Yup.date().required("Ngày, tháng, năm sinh không được để trống").max(getMinDate(), 'Người dùng phải từ 18 tuổi trở lên').min(getMaxDate(), 'Người dùng không được quá 100 tuổi'),
                    gender: Yup.number().required("Giới tính không được để trống"),
                    phoneNumber: Yup.string().required("Số diện thoại không được để trống")
                        .matches(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/, 'Nhập đúng định dạng SDT VD: 098XXXXXXX (X là chữ số)')
                        .test(
                            "check-phone-number",
                            "Số điện thoại đã tồn tại",
                            async function (value) {
                                if (!value) {
                                    return true;
                                }
                                const isPhoneNumberExists = await checkPhoneNumberExists(value);
                                return !isPhoneNumberExists;
                            }),
                    email: Yup.string().required("Email không được để trống").email('Nhập đúng định dạng email')
                        .test(
                            "check-email",
                            "Email đã tồn tại",
                            async function (value) {
                                if (!value) {
                                    return true;
                                }
                                const isEmailExists = await checkEmailExists(value);
                                return !isEmailExists;
                            }),
                    address: Yup.string().required("Địa chỉ không được để trống")
                        .min(10, 'Ký tự phải nhiều hơn 10')
                        .max(100, 'Ký tự phải ít hơn 100')
                        .matches(/^[^+.#()?&]*$/, "Địa chỉ không chứa các ký tự +,.,#,(,),?,&"),
                    citizenCode: Yup.string().required("Căn cước không được để trống")
                        .matches(/^(\d{12})$/, "Nhập không đúng định dạng. Vui lòng kiểm tra lại")
                        .test(
                            "check-citizen-code",
                            "Số căn cước đã tồn tại",
                            async function (value) {
                                if (!value) {
                                    return true;
                                }
                                const isCitizenCodeExists = await checkCitizenCodeExists(value);
                                return !isCitizenCodeExists;
                            }),
                })}
                onSubmit={async (values, {resetForm, setSubmitting}) => {
                    try {
                        const results = await Promise.all([
                            handleAvatarFileUpload(),
                            handleFrontCitizenFileUpload(),
                            handleBackCitizenFileUpload()
                        ]);

                        const avatarUrl = results[0];
                        const frontCitizenUrl = results[1];
                        const backCitizenUrl = results[2];

                        values.gender = parseInt(values.gender);
                        const newValue = {
                            ...values,
                            image: avatarUrl,
                            backCitizen: backCitizenUrl,
                            frontCitizen: frontCitizenUrl
                        };
                        console.log(newValue)
                        await customerService.save(newValue);

                        setSubmitting(false);
                        await Swal.fire({
                            position: 'center',
                            icon: "success",
                            title: "Thêm mới thành công.",
                            text: "Khách hàng " + newValue.name,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        resetForm();
                        navigate("/nav/manager-customer");
                    } catch (e) {
                        await Swal.fire({
                            icon: "error",
                            title: "Thất bại",
                            text: "Cần kiểm tra bổ sung ảnh cần thiết",
                            timer: 1500
                        });
                        setSubmitting(false);
                    }
                }}
            >
                {({isSubmitting, setFieldValue}) => (
                    <div className="dat-nt container mt-5 mb-5 p-2 ">
                        <div className="row  d-flex justify-content-center align-items-center">
                            <div className="col-md-8 col-sm-12">
                                <div className="card px-5 py-4">
                                    <div
                                        className="m-2"
                                    >
                                        <h2 style={{textAlign: "center"}}>THÊM THÔNG TIN KHÁCH HÀNG</h2>
                                    </div>
                                    <Form>
                                        <div className="row">
                                            <div className="col-md-4" style={{textAlign: "center", display: "block"}}>
                                                {avatar ? (
                                                    <div>
                                                        <img
                                                            id="avatar-img"
                                                            src={URL.createObjectURL(avatar)}
                                                            style={{width: "100%"}}
                                                            alt="Image Loading.."/>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm mt-2"
                                                            onClick={() => {
                                                                setAvatarFile(null);
                                                                setAvatarUrl("");
                                                                setFileSelected(false);
                                                            }}
                                                        >
                                                            Xoá
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <img
                                                        id="avatar-img"
                                                        src="https://politicalscience.columbian.gwu.edu/sites/g/files/zaxdzs4796/files/image/profile_graphic_1080x1080.png"
                                                        width="60%"
                                                        alt="Image Loading.."/>
                                                )}
                                                <label id="label-dat" className="mt-2 text-file-name">
                                                    Ảnh chân dung
                                                </label>
                                                {!avatar && (
                                                    <label id="label-dat" htmlFor="file-upload-avatar"
                                                           className="text-name-file mt-4">
                                                        Thêm ảnh chân dung <span style={{color: "red"}}> *</span>
                                                    </label>)}
                                                <Field
                                                    type="file"
                                                    onChange={(event) => {
                                                        handleAvatarFileSelect(event);
                                                        setFileSelected(true);
                                                    }}
                                                    id="image"
                                                    name="image"
                                                    className="form-control-plaintext d-none"
                                                />

                                                {!avatar && (
                                                    <p>
                                                        <label
                                                            htmlFor="image"
                                                            style={{
                                                                display: "flex",
                                                                padding: "6px 12px",
                                                                border: "1px ",
                                                                borderRadius: "4px",
                                                                backgroundColor: "#ccffc6",
                                                                justifyContent: "center",

                                                            }}
                                                        >
                                                            <i className="bi bi-upload"> Chọn hình ảnh</i>
                                                        </label>
                                                    </p>
                                                )}
                                                {fileSelected ? null : (
                                                    <span className="text-danger"> {messageError}</span>
                                                )}
                                                <hr/>

                                            <button type="button"
                                                    className="btn btn-sm btn-success float-start mb-1"
                                                        onClick = {(e)=> handleGetInfoClick()}>Lấy thông tin KH Online
                                                </button>
                                                <input
                                                    className="form-control"
                                                    placeholder="Nhập số điện thoại"
                                                    type="text"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                />

                                            </div>
                                            <div className="col-md-8">
                                                <div className="mt-2">
                                                    <label id="label-dat" htmlFor="f-name">
                                                        Họ và tên <span style={{color: "red"}}> *</span>
                                                    </label>
                                                    <Field
                                                        id="f-name"
                                                        className="form-control"
                                                        name="name"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        component="span"
                                                        name="name"
                                                        className="text-danger"
                                                    />
                                                </div>
                                                <div className="mt-2">
                                                    <label id="label-dat" htmlFor="f-dateOfBirth">
                                                        Ngày sinh
                                                        <span style={{color: "red"}}> *</span>
                                                    </label>
                                                    <Field
                                                        id="f-dateOfBirth"
                                                        className="form-control"
                                                        name="birthday"
                                                        type="date"
                                                    />
                                                    <ErrorMessage
                                                        component="span"
                                                        name="birthday"
                                                        className="text-danger"
                                                    />
                                                </div>
                                            <div className="mt-2">
                                                <div className="mt-2">
                                                        <label id="label-dat" htmlFor="gender" className="form-label">
                                                            Giới tính<span style={{color: "red"}}> *</span>
                                                        </label>
                                                </div>
                                                        <label className='m-2'>
                                                            <Field type="radio" name="gender" value="0"/>
                                                            {' '}Nam
                                                        </label>
                                                        <label className='m-2'>
                                                            <Field type="radio" name="gender" value="1"/>
                                                            {' '}Nữ
                                                        </label>
                                                        <label className='m-2'>
                                                            <Field type="radio" name="gender" value="2"/>
                                                            {' '}Khác
                                                        </label>
                                                        <ErrorMessage
                                                            component="div"
                                                            name="gender"
                                                            className="text-danger"
                                                        />

                                                </div>
                                                <div className="mt-2">
                                                    <label id="label-dat" htmlFor="f-email">
                                                        Email<span style={{color: "red"}}> *</span>
                                                    </label>
                                                    <Field
                                                        id="f-email"
                                                        className="form-control"
                                                        name="email"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        component="span"
                                                        name="email"
                                                        className="text-danger"
                                                    />
                                                </div>
                                                <div className="mt-2">
                                                    <label id="label-dat" htmlFor="f-phone">
                                                        Số điện thoại
                                                        <span style={{color: "red"}}> *</span>
                                                    </label>
                                                    <Field
                                                        id="f-phone"
                                                        className="form-control"
                                                        name="phoneNumber"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        component="span"
                                                        name="phoneNumber"
                                                        className="text-danger"
                                                    />
                                                </div>
                                                <div className="mt-2">
                                                    <label id="label-dat" htmlFor="f-idCard">
                                                        Số căn cước
                                                        <span style={{color: "red"}}> *</span>
                                                    </label>
                                                    <Field
                                                        id="f-idCard"
                                                        className="form-control"
                                                        name="citizenCode"
                                                        type="text"

                                                    />
                                                    <ErrorMessage
                                                        component="span"
                                                        name="citizenCode"
                                                        className="text-danger"
                                                    />
                                                </div>
                                                <div className="mt-2">
                                                    <label id="label-dat" htmlFor="f-country">
                                                        Nơi thường trú
                                                        <span style={{color: "red"}}> *</span>
                                                    </label>
                                                    <Field
                                                        id="f-country"
                                                        className="form-control"
                                                        name="address"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        component="span"
                                                        name="address"
                                                        className="text-danger"
                                                    />
                                                </div>


                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="m-auto d-flex justify-content-center">
                                                <button id="file-upload-label" type='button'
                                                        className="btn btn-sm btn-danger"
                                                >
                                                    Thêm căn cước <i className="bi bi-person-vcard"/>
                                                </button>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="mb-3 col-md-6">
                                                    <label id="label-dat" htmlFor="front-upload"
                                                           className="text-name-file">
                                                        Tải lên mặt trước <span style={{color: "red"}}> *</span>
                                                    </label>
                                                    <Field
                                                        type="file"
                                                        onChange={(event) => {
                                                            handleFrontCitizenFileSelect(event);
                                                            setFileSelected(true);
                                                        }}
                                                        id="frontCitizen"
                                                        name="frontCitizen"
                                                        className="form-control-plaintext d-none"
                                                    />

                                                    {!frontCitizen && (
                                                        <p>
                                                            <label
                                                                htmlFor="frontCitizen"
                                                                style={{
                                                                    display: "flex",
                                                                    padding: "6px 12px",
                                                                    border: "1px ",
                                                                    borderRadius: "4px",
                                                                    backgroundColor: "#ccffc6",
                                                                    justifyContent: "center",
                                                                }}
                                                            >
                                                                <i className="bi bi-upload"> Chọn hình ảnh</i>
                                                            </label>
                                                        </p>
                                                    )}

                                                    {frontCitizen && (
                                                        <div>
                                                            <img
                                                                onChange={handleFrontCitizenFileUpload}
                                                                className="mt-2"
                                                                src={URL.createObjectURL(frontCitizen)}
                                                                style={{width: "100%"}}
                                                                alt="Image Loading.."/>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm mt-2"
                                                                onClick={() => {
                                                                    setFrontCitizenFile(null);
                                                                    setFrontCitizenUrl("");
                                                                    setFileSelected(false);
                                                                }}
                                                            >
                                                                Xoá
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label id="label-dat" htmlFor="back-upload"
                                                           className="text-name-file">
                                                        Tải lên mặt sau <span style={{color: "red"}}> *</span>
                                                    </label>
                                                    <Field
                                                        type="file"
                                                        onChange={(event) => {
                                                            handleBackCitizenFileSelect(event);
                                                            setFileSelected(true);
                                                        }}
                                                        id="backCitizen"
                                                        name="backCitizen"
                                                        className="form-control-plaintext d-none"
                                                    />
                                                    <ErrorMessage
                                                        component="span"
                                                        name="backCitizen"
                                                        className="text-danger"
                                                    />
                                                    {!backCitizen && (
                                                        <p>
                                                            <label
                                                                htmlFor="backCitizen"
                                                                style={{
                                                                    display: "flex",
                                                                    padding: "6px 12px",
                                                                    border: "1px ",
                                                                    borderRadius: "4px",
                                                                    backgroundColor: "#ccffc6",
                                                                    justifyContent: "center",
                                                                }}
                                                            >
                                                                <i className="bi bi-upload"> Chọn hình ảnh</i>
                                                            </label>
                                                        </p>
                                                    )}

                                                    {backCitizen && (
                                                        <div>
                                                            <img
                                                                onChange={handleBackCitizenFileUpload}
                                                                className="mt-2"
                                                                src={URL.createObjectURL(backCitizen)}
                                                                style={{width: "100%"}}
                                                                alt="Image Loading.."
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm mt-2"
                                                                onClick={() => {
                                                                    setBackCitizenFile(null);
                                                                    setBackCitizenUrl("");
                                                                    setFileSelected(false);
                                                                }}
                                                            >
                                                                Xoá
                                                            </button>
                                                        </div>
                                                    )}
                                            </div>
                                                </div>
                                        <div className="m-3 d-flex justify-content-center">
                                            <button
                                                id="show-alert-button"
                                                type="button"
                                                className="btn btn-sm btn-success"
                                                onClick={handleSubmitScanOcr}
                                            >
                                                Phân tích hình ảnh lấy dữ liệu
                                            </button>
                                            <span>{responseText}</span>
                                            </div>
                                            {/*<div className="mt-3">*/}
                                            {/*    <button*/}
                                            {/*        id="show-alert-button"*/}
                                            {/*        type="button"*/}
                                            {/*        className="btn btn-sm btn-success"*/}
                                            {/*        onClick={handleSubmitScanOcr}*/}
                                            {/*    >*/}
                                            {/*        Phân tích hình ảnh lấy dữ liệu*/}
                                            {/*    </button>*/}
                                            {/*</div>*/}
                                        </div>
                                        <div className="row">
                                            {isSubmitting ? (
                                                (<ThreeCircles
                                                    height="60"
                                                    width="60"
                                                    color="#4fa94d"
                                                    wrapperStyle={{}}
                                                    wrapperClass=""
                                                    visible={true}
                                                    ariaLabel="three-circles-rotating"
                                                    outerCircleColor=""
                                                    innerCircleColor=""
                                                    middleCircleColor=""
                                                />)
                                            ) : (
                                                <div className="text-center m-auto">
                                                    <div className="d-flex justify-content-center">
                                                        <div
                                                            className="text-center">
                                                            <Link
                                                                style={{marginLeft: "4vw", width: "130px"}}
                                                                type="button"
                                                                className="btn btn-secondary m-0"
                                                                to={"/nav/manager-customer"}
                                                            >
                                                                <b className="text-center">Quay lại</b>
                                                            </Link>
                                                        </div>
                                                        <div
                                                            className="text-center ms-lg-3 ms-md-2 ms-sm-2">
                                                            <button
                                                                type="submit"
                                                                className="btn btn-success"
                                                                style={{marginLeft: "4vw", width: "130px"}}
                                                            >
                                                                <b className="text-center">Thêm mới</b>
                                                            </button>
                                                        </div>

                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    );
}

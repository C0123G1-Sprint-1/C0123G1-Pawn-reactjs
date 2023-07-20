import * as contractService from "../../service/ContractService";
import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Link, useNavigate} from "react-router-dom";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../firebase";
import Swal from "sweetalert2";
import * as Yup from 'yup';

export const CreateContracts = () => {
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang

    const [selectedFile, setSelectedFile] = useState(null);
    const [firebaseImg, setImg] = useState(null);
    const [progress, setProgress] = useState(0);
    const [imgErr, setImgErr] = useState("");


    const [showModal, setShowModal] = useState(false);
    const [productType, setProductType] = useState([]);
    const [contractType, setContractType] = useState(1);
    const [contractStatus, setContractStatus] = useState(1);
    const [employees, setEmployees] = useState(1);
    const [customer, setCustomer] = useState([]);
    const [code, setCode] = useState('');
    const [idCustomer, setIdCustomer] = useState();
    const [customerName, setCustomerName] = useState('');

    // const [loans, setLoans] = useState('');
    // const [startDate, setStartDate] = useState('');
    // const [endDate, setEndDay] = useState('');

    const n = useNavigate();

    // const handleLoans = async (event) => {
    //     await setLoans(event.target.value)
    // }
    // const handleStartDate = async (event) => {
    //     const {loans,value}=event.target;
    //     await setStartDate((p)=>({
    //         ...p,
    //         [loans]:value
    //     }))
    // }
    //
    // const handleEndDay = async (event) => {
    //     await setEndDay(event.target.value)
    // }

    // let percent = 0.067;
    // const moment = require('moment');
    // const startDates = moment(startDate);
    // const endDates = moment(endDate);
    // // tính khoảng cách ngày
    // const duration = endDates.diff(startDates, 'days');
    // const profits = +(loans * percent * duration)
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setImgErr("");
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmitAsync = async () => {
        return new Promise((resolve, reject) => {
            const file = selectedFile;
            if (!file) return reject("Chưa có file nào được chọn ");
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setImg(downloadURL);
                    resolve(downloadURL);
                }
            );
        });
    };


    useEffect(() => {
        const getAllCustomer = async () => {
            const res = await contractService.findAllCustomer(page,customerName)
            setCustomer(res.content)
            await setTotalPages(res.totalPages)
        }
        getAllCustomer()
    }, [page,customerName])


    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalOpen = () => {
        setShowModal(true);
    };

    const getAllProductType = async () => {
        const res = await contractService.findAllProductType();
        setProductType(res)
    }
    const getAllContractType = async () => {
        const res = await contractService.findAllContractType();
        setContractType(res)
    }
    const getAllContractTStatus = async () => {
        const res = await contractService.findAllContractStatus();
        setContractStatus(res)
    }
    const getAllEmployee = async () => {
        const res = await contractService.findAllAndEmployee();
        setEmployees(res)
    }
    const paginate = (page) => {
        setPage(page)
    }
    const createContractCodeApi = async () => {
        const res = await contractService.createCodeContract();
        setCode(res);
    }
    const getIdProductTypes = (id) => {
        for (let productTypes of productType) {
            if (productTypes.id === id) {
                return productTypes
            }
        }
    }
    const getIdContractType = (id) => {
        for (let contractTypes of contractType) {
            if (contractTypes.id === id) {
                return contractTypes
            }
        }
    }
    const getIdContractStatus = (id) => {
        for (let contractStatusId of contractStatus) {
            if (contractStatusId.id === id) {
                return contractStatusId
            }
        }
    }


    useEffect(() => {
        getAllProductType()
        getAllContractType()
        getAllContractTStatus()
        getAllEmployee()
        createContractCodeApi()
    }, [])



    return (
        <>
            <div className="container">
                <div className="row height d-flex justify-content-center align-items-center">
                    <div className="col-md-6">
                        <div className="card px-5 py-4">
                            <div style={{textAlign: "center"}}>
                                <h1>Thêm mới dịch vụ cầm đồ</h1>
                            </div>
                            <Formik initialValues={{
                                customers: '',
                                contractCode: code,
                                productName: '',
                                productType: '',
                                image: '',
                                loans: '',
                                startDate:'' ,
                                endDate: '',
                                profit: '',
                                contractStatus: 1,
                                contractType: 1,
                                employees: 1
                            }}
                                    validationSchema={Yup.object({
                                        productName: Yup.string()
                                            .trim()
                                            .required('Không được để trống')
                                            .matches(/^[A-Z][a-z]*(\s[A-Z][a-z]*)|(\s[0-9]*)+$/, 'Chữ đầu tiên phải viết hoa'),

                                        loans: Yup.number()
                                            .required('Không được để trống')
                                            .min(500000, 'Tiền cho vay phải > 500.000 hoặc = 500.000')
                                            ,
                                        startDate: Yup.date()
                                            .required('Không được để trống')
                                            .test("date", "Không được chọn quá khứ chỉ chọn hiện tại và tương lai",
                                                function (value) {
                                                    const buyDate = value.getDay()
                                                    const month = value.getMonth()
                                                    const year = value.getFullYear()
                                                    const dateNow = new Date()
                                                    if (year >= dateNow.getFullYear()) {
                                                        if (month > dateNow.getMonth()) {
                                                            return true
                                                        } else if (month === dateNow.getMonth()) {
                                                            if (buyDate >= dateNow.getDay()) {
                                                                return true
                                                            }
                                                        }
                                                    }
                                                    return false;
                                                }),
                                        endDate: Yup.date()
                                            .required('Không được để trống')
                                            .test("date", "Ngày kết thúc phải lớn hơn ngày bắt đầu",
                                                function (value) {
                                                    const startDate = this.resolve(Yup.ref('startDate'));
                                                    return value > startDate;
                                                }),
                                    })}


                                    onSubmit={async (values, {resetForm}) => {
                                        let percent = 0.067;
                                        const moment = require('moment');
                                        const startDates = moment(values.startDate);
                                        const endDates = moment(values.endDate);
                                        // tính khoảng cách ngày
                                        const duration = endDates.diff(startDates, 'days');
                                        const profits = +(values.loans * percent * duration)
                                        const createContracts = async () => {
                                            const newValue = {
                                                ...values,
                                                image: firebaseImg,
                                            };
                                            newValue.image = await handleSubmitAsync();

                                            await contractService.createContract({
                                                ...newValue,
                                                image: newValue.image,
                                                customers: customer.find((cus) => cus.id === idCustomer),
                                                contractType: getIdContractType(+values.contractType),
                                                contractStatus: getIdContractStatus(+values.contractStatus),
                                                contractCode: code + values.contractCode,
                                                productType: getIdProductTypes(+values.productType),
                                                profit: +(profits),
                                                // startDate: startDate,
                                                // endDate: endDate,
                                                // loans: +loans
                                            })
                                            console.log(newValue.image)
                                        }
                                        Swal.fire({
                                            icon: "success",
                                            title: "Thêm mới thành công",
                                            timer: 3000
                                        })
                                        n("/nav/info-store/transaction-history")
                                        resetForm(false)
                                        await createContracts()
                                    }}
                            >
                                <Form >
                                    <div className="text-center m-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-success "
                                            data-bs-target="#static"
                                            onClick={async () => {
                                                handleModalOpen()
                                            }}>
                                            <b className="text-center">Chọn khách hàng</b>
                                        </button>
                                    </div>
                                    {/* nút thêm khách hàng là vd chưa có khách hàng trong danh sách
              lúc đó mình xẽ qua trang thêm khách hàng để thêm mới ạ*/}
                                    <div className="mt-4 inputs">
                                        <label>Tên khách hàng</label>
                                        <Field
                                            disabled
                                            name="customers"
                                            type='text'
                                            // as="select"
                                            className="form-control"
                                            data-error="Please specify your need."
                                            style={{height: 35}}
                                            value={customer.find((cus) => cus.id === idCustomer)?.name}
                                        />


                                    </div>
                                    <div className="mt-2 inputs"><label>Mã hợp đồng</label>
                                        <Field type="text" className="form-control" name="contractCode"
                                               disabled
                                               aria-label="Small"
                                               value={'HD-' + code}
                                               style={{height: "35px"}}
                                        />
                                    </div>
                                    <div className="mt-2 inputs">
                                        <label>Đồ cầm</label>
                                        <Field
                                            type="text"
                                            className="form-control"
                                            name="productName"
                                            style={{height: 35}}
                                        />
                                        <ErrorMessage name="productName" component="p" style={{color: "red"}}/>

                                    </div>
                                    <div className="mt-2 inputs">
                                        <label>Loại đồ</label>
                                        <Field
                                            name="productType"
                                            as="select"
                                            className="form-control"
                                            type="number"
                                            data-error="Please specify your need."
                                            style={{height: 35}}
                                        >
                                            <option value={0} selected="">---Chọn loại---</option>
                                            {productType.map((list, index) => (
                                                <option key={index} value={list.id}>{list.name}</option>
                                            ))}
                                        </Field>


                                    </div>
                                    <div className="mt-2 inputs">
                                        <label htmlFor="image">Hình ảnh</label>
                                        <Field
                                            type="file"
                                            className="form-control"
                                            name="image"
                                            onChange={handleFileSelect}
                                            id="image"
                                            style={{height: 35}}
                                            value={firebaseImg}
                                        />


                                    </div>
                                    <div className="mt-2 inputs">
                                        <label>Tiền cho vay</label>
                                        <Field
                                            type="number"
                                            className="form-control"
                                            name="loans"
                                            style={{height: 35}}
                                            // onChange={handleLoans}
                                            // value={loans.loans}


                                        />
                                        {/*<FormattedNumber value={loans} disabled*/}
                                        {/*                 thousandSeparator={true} currency="VND"*/}
                                        {/*                 minimumFractionDigits={0}/>*/}

                                        <ErrorMessage name="loans" component="p" style={{color: "red"}}/>

                                    </div>
                                    <div className="row mt-2  ">
                                        <div className="col-md-6 form-group">
                                            <label>Ngày bắt đầu</label>
                                            <Field
                                                type="date"
                                                className="form-control"
                                                name="startDate"
                                                style={{height: 36}}
                                                // onChange={handleStartDate}
                                                // value={startDate.startDate}

                                            />
                                            <ErrorMessage name="startDate" component="p" style={{color: "red"}}/>
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <label>Ngày kết thúc</label>
                                            <Field
                                                type="date"
                                                className="form-control"
                                                name="endDate"
                                                style={{height: 36}}
                                                // onChange={handleEndDay}
                                                // value={endDate}

                                            />
                                            <ErrorMessage name="endDate" component="p" style={{color: "red"}}/>
                                        </div>
                                    </div>
                                    {/* khi nhập số tiền cho vay vào và nhập ngày bắt đầu và ngày kết thúc sẽ hiện ra tiền lãi*/}
                                    <div className="mt-2 inputs">
                                        <label>Tiền lãi</label>
                                        <Field
                                            disabled
                                            type="number"
                                            className="form-control"
                                            name="profit"
                                            style={{height: 36}}
                                            // value={profits}

                                        />
                                        {/*<FormattedNumber value={profits} disabled*/}
                                        {/*                 thousandSeparator={true} currency="VND"*/}
                                        {/*                 minimumFractionDigits={0}*/}
                                        {/*/>*/}
                                    </div>
                                    <div className="mt-2 inputs">
                                        {/*<label>Trạng thái</label>*/}
                                        <Field
                                            hidden
                                            disabled
                                            type="number"
                                            className="form-control"
                                            values="1"
                                            name="contractStatus"
                                            style={{height: 35}}
                                        />
                                    </div>
                                    <div className="mt-2 inputs">
                                        {/*<label>Loại hợp đồng</label>*/}
                                        <Field
                                            hidden
                                            disabled
                                            type="number"
                                            className="form-control"
                                            values="1"
                                            name="contractType"
                                            style={{height: 35}}
                                        />
                                    </div>
                                    <div className="mt-2 inputs">
                                        {/*<label>Nhân viên</label>*/}
                                        <Field
                                            hidden
                                            disabled
                                            type="number"
                                            className="form-control"
                                            values="1"
                                            name="employees"
                                            style={{height: 35}}
                                        />
                                    </div>
                                    <div className="col-4">
                                        <div
                                            className="column-gap-lg-3"
                                            style={{width: "100%", marginBottom: "5%", marginLeft: "3%"}}
                                        >
                                            {selectedFile && (
                                                <img
                                                    className={"mt-2"}
                                                    src={URL.createObjectURL(selectedFile)}
                                                    style={{width: "100%", marginLeft: "90%"}}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="d-flex mt-4 justify-content-between">
                                        <div className="text-center" style={{marginLeft: "23.6%"}}>
                                            <Link to="/" className="btn btn-secondary ">
                                                <b className="text-center">Quay lại</b>
                                            </Link>
                                        </div>
                                        <div className="text-center" style={{marginRight: "23.6%"}}>
                                            <button type="submit" className="btn btn-success">
                                                <b className="text-center">Thêm mới</b>
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
            <>
                <div className="text-center mt-4 btn-group p-3 m-l-2">
                    <div className="text-center m-auto">

                        <Modal
                            className="modal-lg"
                            show={showModal}
                            onHide={handleModalClose}

                            keyboard={false}
                            centered
                        >
                            <Modal.Header style={{backgroundColor: "#00833e", color: "white"}}>
                                <Modal.Title style={{width: "100%", textAlign: "center"}}>
                                    <b>Chọn Khách hàng</b>
                                </Modal.Title>
                                <Button
                                    variant="secondary"
                                    className="btn-close"
                                    style={{marginLeft: 0}}
                                    onClick={handleModalClose}
                                />
                            </Modal.Header>
                            <Modal.Body>
                                <div className="controlsmodal-body d-flex justify-content-between">
                                    <div style={{marginTop: "0.6%"}}>
                                        <Link to='/nav/create' type="submit" className="btn btn-outline-success ">
                                            <b className="textcenter">Thêm khách hàng</b>
                                        </Link>
                                    </div>
                                    <Formik initialValues={{
                                        name: ""
                                    }}
                                            onSubmit={async (values) => {

                                                const search = async () => {
                                                    await setCustomerName(values.name)
                                                    const res = await contractService.findAllCustomer(page,values.name)
                                                    setCustomer(res.content)
                                                    setPage(0)
                                                    console.log(values)
                                                }
                                                search()

                                            }}>
                                        <Form className="d-flex m-1">
                                            <Field
                                                style={{width: "18vw", height: "38px"}}
                                                className="form-control me-3"
                                                type="text"
                                                name="name"
                                                placeholder="Tìm kiếm theo tên khách hàng"
                                                aria-label="Search"

                                            />
                                            <button className="btn btn-outline-primary" type="submit">
                                                <i className="bi bi-search"/>
                                            </button>
                                        </Form>
                                    </Formik>
                                </div>
                                <table className="table table-striped">
                                    <thead>
                                    <tr>
                                        <th className="text-center">Mã khách hàng</th>
                                        <th className="text-center">Tên khách Hàng</th>
                                        <th className="text-center">CMND/Hộ chiếu</th>
                                        <th className="text-center">Chức Năng</th>
                                    </tr>
                                    </thead>
                                    {customer.length === 0 ?
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                <h4 style={{color: "red"}}>Dữ liêu không tồn tại</h4>
                                            </td>
                                        </tr>
                                        :
                                        <tbody>
                                        {customer.map((list, index) => (
                                            <tr key={index}>
                                                <td className="text-center">{list.id}</td>
                                                <td className="text-center">{list.name}</td>
                                                <td className="text-center">{list.citizenCode}</td>
                                                <td className="text-center">
                                                    <button onClick={() => {
                                                        setIdCustomer(list.id)
                                                        handleModalClose(true);
                                                    }} className="btn btn-success text-center">
                                                        Chọn
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                        }
                                        {/* Other table rows */}
                                        </tbody>
                                    }
                                </table>
                                {customer.length === 0 ? '' :
                                    <div className="d-flex col-12 justify-content-end">
                                        <nav aria-label="...">
                                            <ul className="pagination">
                                                <li hidden={page === 0} className="page-item ">
                                                    <button className="page-link" tabIndex={-1}
                                                            onClick={() => paginate(page - 1)}>
                                                        Trước
                                                    </button>
                                                </li>

                                                {
                                                    Array.from({length: totalPages}, (a, index) => index).map((pageNumber) => (
                                                        <li className="page-item">
                                                            <button
                                                                className={pageNumber === page ? "page-link active" : "page-link "}
                                                                key={pageNumber}
                                                                onClick={() => paginate(pageNumber)}>
                                                                {pageNumber + 1}
                                                            </button>
                                                        </li>
                                                    ))
                                                }
                                                {page + 1 === totalPages ?
                                                    ""
                                                    : <li disabled={page + 1 === totalPages}
                                                          className="page-item">
                                                        <button className="page-link" tabIndex={-1}
                                                                onClick={() => paginate(page + 1)}>
                                                            Tiếp
                                                        </button>
                                                    </li>}
                                            </ul>
                                        </nav>
                                    </div>
                                }
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
            </>

        </>

    )
}
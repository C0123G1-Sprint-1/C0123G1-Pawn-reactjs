import {ChartComponent} from "./Chart";
import {Routes, Route, Link, NavLink, useParams} from "react-router-dom"
import {Chart} from "chart.js/auto"
import React, {useEffect, useState} from "react";
import {Outlet} from "react-router";
import axios from "axios";
import {Field, Form, Formik} from "formik";

export default function Profit() {
    const [contracts, setContract] = useState()
    const [profitType, setProfitType] = useState();
    const [totalPage, setTotalPage] = useState();
    const [totalProfit, setTotalProfit] = useState(0);
    const type = useParams();
    const [dataProfit, setDataProfit] = useState();
    const [dateTimeProfit, setDateTimeProfit] = useState({
        startDate: "",
        endDate: ""
    })

    const pagination = () => {
        const page = [];
        for (let i = 0; i < totalPage; i++) {
            page.push(
                <li className="page-item" key={i}>
                    <a className="page-link isActive"
                       onClick={() => getContract(dateTimeProfit.startDate, dateTimeProfit.endDate, i, profitType || type.type)}>
                        {i + 1}
                    </a>
                </li>
            )
        }
        return page;
    }
    const getProfit = async (startDate, endDate, profitType) => {
        const res = await axios.get("http://localhost:8080/api/employee/profit/total-profit?startDate=" + startDate + "&endDate=" + endDate + "&profitType=" + profitType)
        console.log(3)
        setTotalProfit(res.data)
    }

    const getDataProfit = async (startDate, endDate, profitType) => {
        const res = await axios.get("http://localhost:8080/api/employee/profit/statistics-profit?startDate=" + startDate + "&endDate=" + endDate + "&profitType=" + profitType)
        console.log(2)
        setDataProfit(res.data)
    }
    const getContract = async (startDate, endDate, page, profitType) => {
        const res = await axios.get("http://localhost:8080/api/employee/profit?startDate=" + startDate + "&endDate=" + endDate + "&page=" + (page || 0) + "&profitType=" + profitType)
        console.log(1)
        setTotalPage(res.data.totalPages)
        setContract(res.data.content)
    }

    useEffect(() => {
        const fectData = async () => {
            await getContract(dateTimeProfit.startDate, dateTimeProfit.endDate, 0, profitType || type.type)
            await getDataProfit(dateTimeProfit.startDate, dateTimeProfit.endDate, profitType || type.type)
            await getProfit(dateTimeProfit.startDate, dateTimeProfit.endDate, profitType || type.type)
        }
        fectData()
    }, [profitType])
    if (!dataProfit || !contracts) {
        return null;
    }
    return (
        <>
            <div align="center" id="header">
                <h1>Header</h1>
            </div>
            <div id="content" className="container">
                <div className="row mt-5">
                    <div className="col-md-12 col-lg-3">
                        <div className="list-group">
                            <a
                                href="#"
                                className="list-group-item list-group-item-action active "
                                id="nav-side-bar"
                                aria-current="true"
                            >
                                Thông tin cửa hàng
                            </a>
                            <a href="#" className="list-group-item list-group-item-action">
                                Tài chính
                            </a>
                            <a href="#" className="list-group-item list-group-item-action">
                                Danh sách đồ cầm trong kho
                            </a>
                            <a href="#" className="list-group-item list-group-item-action">
                                Lịch sử giao giao dịch
                            </a>
                            <a className="list-group-item list-group-item-action ">
                                Top 10 hợp đồng mới nhất
                            </a>
                            <a className="list-group-item list-group-item-action active" id="statistic-profit">
                                Thống kê lợi nhuận
                            </a>
                        </div>
                    </div>
                    <div className="col-md-12 col-lg-9 content-profit">
                        <div className="row">
                            <div className=" col-lg-12" align="center">
                                <ul className="d-flex nav-content justify-content-center">
                                    <li><NavLink onClick={() => setProfitType("interest")} style={({isActive}) => {
                                        return {
                                            backgroundColor: isActive ? "#27533e" : "",
                                            color: isActive ? "#fff" : ""
                                        }
                                    }} to="/profit/interest/interest" className="btn btn-sm  ">Lợi nhuận từ tiền
                                        lãi</NavLink></li>
                                    <li><NavLink onClick={() => setProfitType("liquidation")} style={({isActive}) => {
                                        return {
                                            backgroundColor: isActive ? "#27533e" : "",
                                            color: isActive ? "#fff" : ""
                                        }
                                    }} to="/profit/liquidation/liquidation" className="btn btn-sm  ">Lợi nhuận từ thanh
                                        lý</NavLink>
                                    </li>
                                    <li><NavLink onClick={() => setProfitType("foresee")} style={({isActive}) => {
                                        return {
                                            backgroundColor: isActive ? "#27533e" : "",
                                            color: isActive ? "#fff" : ""
                                        }
                                    }} to="/profit/foresee/foresee" className="btn btn-sm  ">Lợi nhuận dự kiến</NavLink>
                                    </li>
                                </ul>
                            </div>
                            <div className="row  col-lg-12 mt-3 p-0">
                                <div className="p-0">
                                    <Formik
                                        initialValues={{
                                            startDate: "",
                                            endDate: ""
                                        }}
                                        onSubmit={async (values) => {
                                            await getContract(values.startDate, values.endDate, 0, profitType || type.type)
                                            await getDataProfit(values.startDate, values.endDate, profitType || type.type)
                                            await getProfit(values.startDate, values.endDate, profitType || type.type)
                                            setDateTimeProfit({
                                                startDate: values.startDate,
                                                endDate: values.endDate
                                            })
                                        }}>
                                        <Form className="p-0 ms-5">
                                            <div className="d-flex col-lg-12 justify-content-between p-0">
                                                <div className=" col-lg-5 p-0">
                                                    <span>Từ ngày : <Field name="startDate" type="date"/></span>
                                                </div>
                                                <div className=" col-lg-5">
                                                    <span>Đến : <Field name="endDate" type="date"/></span>
                                                </div>
                                                <div className=" col-lg-2 p-0 d-flex justify-content-end">
                                                    <button type="submit" className="btn btn-sm btn-primary">Thống kê
                                                    </button>
                                                </div>
                                            </div>
                                        </Form>
                                    </Formik>
                                    <label className="mt-3 p-0 ms-5" style={{color: "indianred"}}>
                                        Tổng lợi nhuận :{" "}
                                        <input type="text" disabled value={totalProfit}/>
                                    </label>
                                </div>
                            </div>
                            <div className="container">
                                <ChartComponent data={dataProfit}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" mt-3 container col-12">
                <Outlet context={contracts}/>
                <div className="d-flex  col-lg-12 justify-content-end">
                    <nav aria-label="...">
                        <ul className="pagination">
                            <li className="page-item disabled">
                                <a
                                    className="page-link"
                                    href="#"
                                    tabIndex={-1}
                                    aria-disabled="true"
                                >
                                    Trước
                                </a>
                            </li>
                            {
                                pagination()
                            }
                            <li className="page-item">
                                <a className="page-link" href="#">
                                    Sau
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div align="center" id="footer">
                <h1>Footer</h1>
            </div>
        </>
    )
}

import { Button, TableBody, TableCell, TableContainer, TableHead, Paper, Table, TableRow, Dialog, DialogTitle, DialogContent, Stack, TextField, RadioGroup, FormControlLabel, Radio, Checkbox, TablePagination, IconButton } from '@mui/material'
import React, { useState, useEffect } from 'react';
import { CreateCompany, GetAllCompanys, GetCompanybycode, RemoveCompany, UpdateCompany } from "../Redux/ActionCreate";
import { connect, useDispatch, useSelector } from "react-redux";
import { OpenPopup } from "../Redux/Action";
import CloseIcon from "@mui/icons-material/Close"


const Company = (props) => {
    const columns = [
        { id: "id", name: "Id" },
        { id: "name", name: "Name" },
        { id: "email", name: "Email" },
        { id: "phone", name: "Phone" },
        { id: "address", name: "Address" },
        { id: "type", name: "Company Type" },
        { id: "action", name: "Action" },

    ]
    const dispatch = useDispatch();

    const [open, openchange] = useState(false);
    const [id, idChange] = useState(0);
    const [name, nameChange] = useState('');
    const [email, emailChange] = useState('');
    const [phone, phoneChange] = useState('');
    const [address, addressChange] = useState('');
    const [type, typeChange] = useState("MNC");
    const [agreeterm, agreetermChange] = useState(true);

    const [rowperpage, rowperpageChange] = useState(5);
    const [page, pageChange] = useState(0);

    const [isedit, iseditChange] = useState(false);
    const [title, titleChange] = useState('Create company');

    const editobj = useSelector((state) => state.company.companyobj);

    useEffect(() => {
        if (Object.keys(editobj).length > 0) {
            idChange(editobj.id);
            nameChange(editobj.name);
            emailChange(editobj.email);
            phoneChange(editobj.phone);
            addressChange(editobj.Address);
            typeChange(editobj.type);
        } else {
            clearstate();
        }

    }, [editobj])

    const handlepagechange = (event, newpage) => {
        pageChange(newpage);
    }

    const handlerowperpagechange = (event) => {
        rowperpageChange(+event.target.value);
        pageChange(0);
    }



    const functionadd = () => {
        iseditChange(false);
        titleChange('Create company');
        openpopup();
    }
    const closepopup = () => {
        openchange(false);
    }
    const openpopup = () => {
        openchange(true);
        clearstate();
        dispatch(OpenPopup())

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const _obj = { id, name, email, phone, address, type };
        if (isedit) {
            dispatch(UpdateCompany(_obj));
        } else {
            dispatch(CreateCompany(_obj));
        }
        closepopup();
    }

    const handleEdit = (code) => {
        iseditChange(true);
        titleChange('Update company');
        openchange(true);
        dispatch(GetCompanybycode(code))
    }

    const handleRemove = (code) => {
        if (window.confirm('Do you want to remove?')) {
            dispatch(RemoveCompany(code));
        }
    }


    const clearstate = () => {
        idChange(0);
        nameChange('');
        emailChange('');
        phoneChange('');
        addressChange('');
        typeChange('MNC');
    }
    useEffect(() => {
        props.loadcompany();
    }, [])

    return (
        props.companystate.isloading ? <div><h2>Loading.....</h2></div> :
            props.companystate.errormessage ? <div><h2>{props.companystate.errormessage}</h2></div>:

                <div>
                    <Paper>
                        <div style={{ margin: "1%" }}>
                            <Button onClick={functionadd} variant='contained'>Add New (+)</Button>
                        </div>
                        <div style={{ margin: "1%" }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow style={{ backgroundColor: "midnightblue" }}>
                                            {columns.map((column) =>
                                                <TableCell key={column.id} style={{ color: "white" }}>{column.name}</TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {props.companystate.companylist &&
                                            props.companystate.companylist
                                                .slice(page * rowperpage, page * rowperpage + rowperpage)
                                                .map((row, i) => {
                                                    return (
                                                        <TableRow key={i}>
                                                            <TableCell>{row.id}</TableCell>
                                                            <TableCell>{row.name}</TableCell>
                                                            <TableCell>{row.email}</TableCell>
                                                            <TableCell>{row.phone}</TableCell>
                                                            <TableCell>{row.Address}</TableCell>
                                                            <TableCell>{row.type}</TableCell>
                                                            <TableCell>
                                                                <Button onClick={e => { handleEdit(row.id) }} variant="contained" color="primary">Edit</Button>
                                                                <Button onClick={e => { handleRemove(row.id) }} variant="contained" color="error">Delete</Button>

                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                        }

                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[2, 5, 10, 20]}
                                rowsPerPage={rowperpage}
                                page={page}
                                count={props.companystate.companylist.length}
                                component={'div'}
                                onPageChange={handlepagechange}
                                onRowsPerPageChange={handlerowperpagechange}
                            >

                            </TablePagination>


                        </div>
                    </Paper>
                    <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
                        <DialogTitle>
                            <span>{title}</span>
                            <IconButton style={{ float: 'right' }} onClick={closepopup}><CloseIcon color="primary"></CloseIcon></IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <form onSubmit={handleSubmit}>
                                <Stack spacing={2} margin={2}>
                                    <TextField required error={name.length === 0} value={name} onChange={e => { nameChange(e.target.value) }} variant='outlined' label="Name"></TextField>
                                    <TextField required error={name.length === 0} value={email} onChange={e => { emailChange(e.target.value) }} variant='outlined' label="Email"></TextField>
                                    <TextField required error={name.length === 0} value={phone} onChange={e => { phoneChange(e.target.value) }} variant='outlined' label="Phone"></TextField>
                                    <TextField multiline maxRows={2} minRows={2} value={address} onChange={e => { addressChange(e.target.value) }} variant='outlined' label="Address"></TextField>
                                    <RadioGroup value={type} onChange={e => { typeChange(e.target.value) }} row>
                                        <FormControlLabel value="MNC" control={<Radio color='success'></Radio>} label="MNC"></FormControlLabel>
                                        <FormControlLabel value="DOMESTIC" control={<Radio></Radio>} label="DOMESTIC"></FormControlLabel>
                                    </RadioGroup>
                                    <FormControlLabel checked={agreeterm} onChange={e => { agreetermChange(e.target.checked) }} control={<Checkbox></Checkbox>} label="Agree Term & Condition"></FormControlLabel>
                                    <Button disabled={!agreeterm} variant='contained' type='submit'>Submit</Button>
                                </Stack>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
    )
}

const mapStatetoProps = (state) => {
    return {
        companystate: state.company
    }
}

const mapDispatchtoProps = (dispatch) => {
    return {
        loadcompany: () => dispatch(GetAllCompanys())
    }
}


export default connect(mapStatetoProps, mapDispatchtoProps)(Company);

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Container, Button, Form, Table, Modal, FormControl, InputGroup } from 'react-bootstrap';
import styles from './Studentmaster.css';
import './common.css';
import { FaPencilAlt, FaTrashAlt, FaEye, FaPlus, FaSearch } from "react-icons/fa";
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const StudentMaster = (props) => {

  const [search, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);
  const [editshow, setEditShow] = useState(false);
  const [masterTable, setmasterTable] = useState({
    id: '',
    StudentName: '',
    StudentRollnum: '',
    StudentMark: '',
  });
  const [StudentList, setStudentList] = useState([]);
  const [editstudentList, setEditStudentList] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editChange, setEditChange] = useState({
    newStudent: '',
    newStudentRole: '',
  });
  const handleClose = () => setShow(false);
  const handleEditClose = () => setEditShow(false);
  const handleShow = () => setShow(true);
  const handleEditShow = () => setEditShow(true);

  

  const options = {
    // onOpen: props => console.log(props.foo),
    // onClose: props => console.log(props.foo),
    autoClose: 2000,
    draggable: true,
    hideProgressBar: false,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    closeOnClick: true
  };

  let i = 1;
  function sno() { return i++; }

  useEffect(() => {
    Axios.get("/student-master", {
    }).then((response) => {
      let result = response.data.recordset;
      setStudentList(result);
    });
  }, [refreshKey]);

  const handleMasterChange = (e) => setmasterTable({
    ...masterTable,
    [e.target.name]: [e.target.value],
  });

  const handleSubmit = (e) => {
    if ((masterTable.studentName != "") && (masterTable.StudentRollnum != "") && (masterTable.StudentMark != "") && (masterTable.studentRole != "")) {
      e.preventDefault();
      Axios.post("/student-master",
        {
          studentName: masterTable.studentName, StudentRollnum: masterTable.StudentRollnum,
          StudentMark: masterTable.StudentMark
        },{

        } )
      
        .then(
          (response) => {
            if (response.data.status == true) {
              handleClose();
              setRefreshKey(oldKey => oldKey + 1);
              toast.success(`New student ${masterTable.studentName} added.`, options);
            }
            else if (response.data.status == false) {
              handleClose();
              toast.info(`${response.data.message}`, options);
            }
          });
    }
    else {
      toast.info("Empty value are not valid please Enter Valid  Details");
    }

  };

  const handleEditValue = (event) => setEditChange({
    ...editChange,
    [event.target.name]: [event.target.value],
  });

  const handleEditSubmit = () => {
    if ((editChange.StudentRollnum != "") && (editChange.StudentRole != "")) {
      const id = editUserLits.id;
      Axios.patch(`/student-master/${id}`,
        { id: id, newrollnum: editChange.newrollnum, newStudentRole: editChange.StudentRole }, {
        headers: {
          "x-access-token": localStorage.getItem(`login`)
        }
      })
        .then((response) => {
          if (response.status === 200) {
            handleEditClose();
            setRefreshKey(oldKey => oldKey + 1);
            toast.success(`New updated successfully.`, options);
          }
        });
    }
    else {
      toast.info("Please update password or UserRole")
    }
  }

  const handleEdit = (id) => {
    const editStudentDataRow = userLits.find(item => item.id === id);
    setEditStudentLits(editStudentDataRow);
    handleEditShow();
  };

  const handleDelete = (id) => {
    Axios.delete(`/student-master/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem(`login`),
      }
    }).then((response) => {
      if (response.status == 200) {
        setRefreshKey(oldKey => oldKey + 1);
        toast.info(`Student deleted.`, options);
      }
    });
  }

  return (
    <div className="wrapper">
      <Container>
        <ToastContainer
          newestOnTop={false}
          rtl={false}
        />

        <Row><Col className="mt-5 mb-2"><h1 className="main_title">Student Master</h1></Col></Row>

        <Row className="mb-2">
          <Col md={2} xs={12} sm={2} lg={2}>
            <Button variant="primary" onClick={handleShow}><FaPlus id="custom_icon" />New user</Button>
          </Col>

          <Col md={4} xs={12} sm={2} lg={6}>
            <div className="mb-3">
              <Form id="search-form">
                <InputGroup id="search-form-student-master">
                  <FormControl
                    placeholder="Search Your Keyword"
                    aria-label="Search Your Keyword"
                    aria-describedby="basic-addon2"
                    onChange={event => {setSearchTerm(event.target.value)}}
                  />
                  <InputGroup.Append>
                    <Button variant="outline-secondary" id="search-button">
                      <FaSearch />
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form>
            </div>
          </Col>
        </Row>

        <Table style={{ width: '70%' }}>
          <thead style={{ background: '#8b8498' }}>
            <tr>
              <th>S.No</th>
              <th>Student Name</th>
              <th>Student Rollnum</th>
              <th>Student Mark</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userLits?.filter((val) => {
              if(search == "") {
                return val
              } else if(val.user_name.toLowerCase().includes(search.toLowerCase())){
                return val
              }
            }).map((value) => {
              return <tr key={value.id}>
                <td>{sno()}</td>
                <td>{value.user_name}</td>
                <td>{value.email}</td>
                <td>{value.user_role}</td>
                <td>
                  <FaPencilAlt onClick={() => handleEdit(value.id)} id="master_user_edit" />
                  <FaTrashAlt id="master_user_delete" onClick={() => handleDelete(value.id)} />
                </td>
              </tr>;
            })}
          </tbody>
        </Table>

        {/* Add New user to master table STARTS */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton id="modal-header">
            <Modal.Title>Student Master</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} controlId="formPlaintext">
                <Form.Label column sm="3">Student Name</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    type="text"
                    name="StudentName"
                    onChange={handleMasterChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlainetext">
                <Form.Label column sm="3"> Student Id</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    type="rollnum"
                    name="studentId"
                    onChange={handleMasterChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlaintextMark">
                <Form.Label column sm="3">StudentMark</Form.Label>
                <Col sm="9">
                  <InputGroup className="mb-3">
                    <FormControl
                      type={StudentMark ? "text" : "mark"}
                      name="mark"
                      required
                      aria-label="mark"
                      aria-describedby="basic-addon2"
                      onChange={handleMasterChange}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text id="basic-addon2">
                        <i onClick={togglemarkVisiblity}><FaEye id="M-show-icon" /></i>
                      </InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="ControlSelect1">
                <Form.Label column sm="3">Role</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    as="select"
                    defaultValue="Choose..."
                    name="studentRole"
                    onChange={handleMasterChange}
                  >
                    <option>Choose...</option>
                    <option>StudentName</option>
                    <option>StudentRollnum</option>
                    <option>StudentMark</option>
                  </Form.Control>
                </Col>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col>
                <Button variant="secondary" onClick={handleClose} id="modal-cancel">
                  Close
                </Button>
              </Col>
              <Col>
                <Button variant="primary" onClick={handleSubmit} id="modal-submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
        {/* Add New user to master table ENDS */}

        {/* Add Edit user to master table ENDS */}
        <Modal show={editshow} onHide={handleEditClose} centered>
          <Modal.Header closeButton id="modal-header">
            <Modal.Title>Edit student master - {editStudentLits.user_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} controlId="formPlaintext">
                <Form.Label column sm="3">Student Name</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    type="text"
                    name="studentName"
                    value={editStudentLits.user_name}
                    readOnly
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlainetext">
                <Form.Label column sm="3"> Student Id</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    name="studentId"
                    value={editStudentLits.mark}
                    readOnly
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlaintextStudent">
                <Form.Label column sm="3">New Student</Form.Label>
                <Col sm="9">
                  <InputGroup className="mb-3">
                    <FormControl
                      type={StudentmarkShown ? "text" : "mark"}
                      name="newmark"
                      required
                      aria-label="mark"
                      aria-describedby="basic-addon2"
                      onChange={handleEditValue}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text id="basic-addon2">
                        <i onClick={togglePasswordVisiblity}><FaEye id="mark-show-icon" /></i>
                      </InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="ControlSelect1">
                <Form.Label column sm="3">Role</Form.Label>
                <Col sm="9">
                  <Form.Control
                    required
                    as="select"
                    defaultValue={editStudentLits.user_role}
                    name="StudentRole"
                    onChange={handleEditValue}
                  >
                    <option>Student Name</option>
                    <option>Student Rollnum</option>
                    <option>Student Mark</option>
                  </Form.Control>
                </Col>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col>
                <Button variant="secondary"
                  onClick={handleEditClose}
                  id="modal-cancel">
                  Close
                </Button>
              </Col>
              <Col>
                <Button variant="primary"
                  onClick={handleEditSubmit}
                  id="modal-submit">
                  Update
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
        {/* Add Edit user to master table ENDS */}

      </Container>
    </div>
  );
};
StudentMaster.propTypes = {};

StudentMaster.defaultProps = {};

export default StudentMaster;
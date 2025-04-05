import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Loader from './components/Loader'
import Register from './components/Register'
import Teachers from './components/Teachers'
import Student from './components/Student'
import Setting from './components/Setting'
import AddTeachers from './components/AddTeachers'
import AddStudents from './components/AddStudents'
import CreateSchool from './components/CreateSchool'
import SchoolAssign from './components/SchoolAssign'
import SchoolListClass from "./components/SchoolListClass"
import ViewAttendance from './components/ViewAttendance'
import ParentDash from './components/ParentDash'
import TeachersDashboard from './components/TeachersDashboard'
import ViewAllAttendance from './components/ViewAllAttendance'
import AcceptTeacher from './components/AcceptTeacher'
import Mark from './components/Mark'  // You'll need to create this component
import AssignStudent from './components/AssignStudent'
import NoStudent from './components/NoStudent'
import Profile from './components/Profile'
import ViewProfile from './components/ViewProfile'
import SchoolViewAllAttendance from './components/SchoolViewAllAttendance'
import ListOfParents from './components/ListOfParents';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Loader />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Teachers" element={<Teachers />} />
        <Route path="/Student" element={<Student />} />
        <Route path="/CreateClass" element={<CreateSchool />} />
        <Route path="/List" element={<SchoolListClass />} />
        <Route path="/Setting" element={<Setting />} />
        <Route path="/sendIviteToTeachers" element={<AddTeachers />} />
        <Route path="/View" element={<ViewAttendance />} />
        <Route path="/Parent" element={<ParentDash />} />
        <Route path="/TeachersDashboard" element={<TeachersDashboard />} />
        <Route path="/AddStudent" element={<AddStudents />} />
        <Route path="/Mark" element={<Mark/>} />
        <Route path="/AssignStudents" element={<AssignStudent/>} />
        <Route path="/class/:classId/NoStudent" element={<NoStudent />} />
        <Route path="/ViewAll/:schoolId" element={<ViewAllAttendance />} />
        <Route path="/accept/:inviteId" element={<AcceptTeacher />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/AssignTeacher" element={<SchoolAssign />} />
        <Route path="/ViewProfile" element={<ViewProfile />} />
        <Route path="/ListOfParent" element={<ListOfParents />} />
        <Route path="/Attendance-details" element={<SchoolViewAllAttendance />} />
      </Routes>
    </>
  )
}

export default App

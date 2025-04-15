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
import SchoolAssign from './components/SchoolAssign'
import ListofClass from "./components/ListofClass"
import ViewAttendance from './components/ViewAttendance'
import ParentDash from './components/ParentDash'
import TeachersDashboard from './components/TeachersDashboard'
import ViewAllAttendance from './components/ViewAllAttendance'
import Mark from './components/Mark'
import AssignStudent from './components/AssignStudent'
import NoStudent from './components/NoStudent'
import Profile from './components/Profile'
import ViewProfile from './components/ViewProfile'
import SchoolViewAllAttendance from './components/SchoolViewAllAttendance'
import ListOfParents from './components/ListOfParents'
import CreateClass from './components/CreateClass'
import MyProfile from './components/MyProfile'
import AddSubject from './components/AddSubject'
import AssignSubjectToClass from './components/AssignSubjectToClass'
import SubjectList from './components/SubjectList'
import SchoolEdit from './components/SchoolEdit'
import InvitationPage from './components/InvitationPage'
import ParentView from './components/ParentView'
import ResultUpload from './components/ResultUpload'
import StudentProfile from './components/StudentProfile'
import StudentIdCard from './components/StudentIdCard'
import AssignTeacherToClass from './components/AssignTeacherToClass'
import { Link } from 'react-router-dom'
import Admission from './components/Admission'

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
        <Route path="/CreateClass" element={<CreateClass />} />
        <Route path="/List" element={<ListofClass />} />
        <Route path="/Setting" element={<Setting />} />
        <Route path="/sendInviteToTeachers" element={<AddTeachers />} />
        <Route path="/View" element={<ViewAttendance />} />
        <Route path="/Parent" element={<ParentDash />} />
        <Route path="/TeachersDashboard" element={<TeachersDashboard />} />
        <Route path="/AddStudent" element={<AddStudents />} />
        <Route path="/Mark" element={<Mark/>} />
        <Route path="/AssignStudents" element={<AssignStudent/>} />
        <Route path="/class/:classId/NoStudent" element={<NoStudent />} />
        <Route path="/ViewAll/:schoolId" element={<ViewAllAttendance />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/AssignTeacher" element={<SchoolAssign />} />
        <Route path="/ViewProfile" element={<ViewProfile />} />
        <Route path="/ListOfParent" element={<ListOfParents />} />
        <Route path="/Attendance-details" element={<SchoolViewAllAttendance />} />
        <Route path="/MyProfile" element={<MyProfile />} />
        <Route path="/CreateSubject" element={<AddSubject />} />
        <Route path="/AssignSubjectToClass" element={<AssignSubjectToClass />} />
        <Route path="/SubjectList" element={<SubjectList />} />
        <Route path="/StudentProfile" element={<StudentProfile />} />
        <Route path="/Admission" element={<Admission />} />
        <Route path="/SchoolEdit" element={<SchoolEdit />} />
        <Route path="/Invitation" element={<InvitationPage />} />
        <Route path="/student/id-card/:id" element={<StudentIdCard />} />
        <Route path="/ResultUpload" element={<ResultUpload />} />
        <Route path="/assign-subject/:subjectId" element={<AssignSubjectToClass />} />
        <Route path="/parent/view/:studentId" element={<ParentView />} />
        <Route path="/student/profile/:studentId" element={<StudentProfile />} />
        <Route path="/teachers/assign-to-class" element={<AssignTeacherToClass />} />
      </Routes>
    </>
  )
}

export default App

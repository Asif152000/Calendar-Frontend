module.exports = {
  APILOCALURL: "https://localhost:7149/api/",// Base API URL for local development
APISERVERURL: "",  // Set this if you have a different server environment URL
APIACTIVATEURL: "https://localhost:7149/api/",// Activate URL for actions like login or registration

  LOGINUSER: "home/login",
  REGISTER: "home/register",

  CREATECOMPANYMANAGEMENT: "CompanyManagement/Create",
  UPDATECOMPANYMANAGEMENT: "CompanyManagement",
  DELETECOMPANYMANAGEMENT: "CompanyManagement",
  GETALLCOMPANYMANAGEMENT: "CompanyManagement/GetAll",
  GETCOMPANYMANAGEMENT: "CompanyManagement",

  CREATECOMMUNICATIONMANAGEMENT: "CommunicationManagement/Create",
  UPDATECOMMUNICATIONMANAGEMENT: "CommunicationManagement",
  DELETECOMMUNICATIONMANAGEMENT: "CommunicationManagement",
  GETALLCOMMUNICATIONMANAGEMENT: "CommunicationManagement/GetAll",
  GETCOMMUNICATIONMANAGEMENT: "CommunicationManagement",

  GETNOTIFICATION: "CompanyCommunication/status",
  GETCOMMUNICATION: "CompanyCommunication/GetAllCompanyCommunications",
  GETALLCOMMUINCATION: "CompanyCommunication/GetAll",
  UPDATECOMMUNICATION: "CompanyCommunication/UpdateStatus",
  GETCALENDAR: "CompanyCommunication/GetCompanyCommunications",
  GETCOUNT: "CompanyCommunication/GetNotificationCounts"


};

import { GoogleLogin } from "@react-oauth/google";

export default function GoogleLoginBtn() {
  return (
    <GoogleLogin
      onSuccess={(cred)=>{
        console.log("Google Token:", cred);
        // send to backend verify endpoint
      }}
      onError={()=>console.log("Login Failed")}
    />
  );
}

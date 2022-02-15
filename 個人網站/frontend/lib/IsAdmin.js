import { useMyContext } from "../contexts/MyContext";

export default function IsAdmin() {
    const {UserName} = useMyContext();
    if(UserName === "admin" || UserName === "test" || UserName === "Starshunter") {
        return true;
    }
    return false;
}
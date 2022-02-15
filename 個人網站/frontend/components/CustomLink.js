import Link from "next/link";
import Cookies from "universal-cookie";
import { useMyContext } from "../contexts/MyContext";

export default function CustomLink({text, url, styles}) {
    const {logout} = useMyContext();
    return (
        <Link href={url}>
            <a className={styles.link} style={{textDecoration: "none"}} onClick={() => {
            if(text === "登出") {
                logout();
            }
        }}>
                <div>{text}</div>
            </a>
        </Link>
    )
}
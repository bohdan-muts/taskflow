import { Outlet } from "react-router-dom";
const Layout = ()=> {
    return (
        <>
            <main className="main">
                <div className="container"><Outlet></Outlet></div>
            </main>
        </>
    );
}

export default Layout;
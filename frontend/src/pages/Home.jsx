import { useEffect, useState } from "react";
import api from "../api";
import Menu from "../components/homeMenu/Menu";
import WorkCalendar from "../components/calendar/CalendarTest";

function Home() {
    return <div>
        <div>
            <Menu />
        </div>

        {/* <div>
            <WorkCalendar />
        </div> */}

    </div>
}

export default Home
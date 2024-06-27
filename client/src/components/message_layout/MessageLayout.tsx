import "./messageLayout.scss";
import Sidebar from "../sidebar/Sidebar";

export default async function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <Sidebar>
      <div className="message-layout">{children}</div>
    </Sidebar>
  );
}

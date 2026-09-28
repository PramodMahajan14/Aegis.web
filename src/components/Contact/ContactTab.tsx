import type { ContactTabProps } from "../../hooks/Contact/contacttype";
import { useProspect } from "../../hooks/Prospect/useProspect";
import { useGetContactList } from "../../hooks/Contact/useContact";

const ContactTab: React.FC<ContactTabProps> = ({ ProspectId }) => {
    const { data: prospect } = useProspect(ProspectId)
    const { data: contactList } = useGetContactList(ProspectId)
    console.log(contactList)
    return (
        <div className="bg-card border-1 rounded-sm">
            <div className="px-2 py-1 flex  flex-row text-foreground gap-1 align-center"><i className="bi bi-list" />
                <p className="text-foreground">List of  '{prospect?.name}'  contacts</p></div>
        </div>

    )
}
export default ContactTab;
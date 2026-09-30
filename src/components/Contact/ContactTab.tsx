import type { ContactTabProps } from "../../hooks/Contact/contacttype";
// import { useProspect } from "../../hooks/Prospect/useProspect";
// import { useGetContactList } from "../../hooks/Contact/useContact";
import ContactList from "../../pages/Contacts/ContactList";

const ContactTab: React.FC<ContactTabProps> = ({ ProspectId }) => {

    return (
        <div>
            <ContactList ProspectId={ProspectId} />
        </div>

    )
}
export default ContactTab;
import type { ContactTabProps } from "../../hooks/Contact/contacttype";
// import { useProspect } from "../../hooks/Prospect/useProspect";
// import { useGetContactList } from "../../hooks/Contact/useContact";
import { CardContent } from "../ui";
import ContactList from "../../pages/Contacts/ContactList";

const ContactTab: React.FC<ContactTabProps> = ({ ProspectId }) => {

    return (
        <CardContent>
            <ContactList ProspectId={ProspectId} />
        </CardContent>

    )
}
export default ContactTab;
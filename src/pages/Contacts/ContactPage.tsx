import PageHeader from "../../components/Layout/PageHeader";
import { PageContainer } from "../../components/ui/PageContainer";
import ContactList from "./ContactList";

const ContactPage = () => {


    return (
        <PageContainer>
            <PageHeader
                crumbs={['Sales', 'Prospects']}
                description="Every project pursuit — before and after it becomes an opportunity."

            />
            <ContactList ProspectId={null} />
        </PageContainer>
    )
}
export default ContactPage;

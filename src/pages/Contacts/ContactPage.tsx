import { Page, PageBar, PageContent } from "../../components/ui/Page";
import ContactList from "./ContactList";

const ContactPage = () => {
    return (
        <Page>
            <PageBar title="Contacts" description="Everyone you work with across your prospects." />
            <PageContent>
                <ContactList ProspectId={null} />
            </PageContent>
        </Page>
    )
}
export default ContactPage;

import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';

export default function GoogleMap() {
  return (
    <>
      <PageHeader title="Google Map" crumbs={['Maps', 'Google Map']} />
      <Card title="Office Location" bodyClassName="p-0">
        <iframe
          title="Google Map"
          width="100%"
          height="420"
          style={{ border: 0, borderRadius: '0 0 10px 10px', display: 'block' }}
          loading="lazy"
          src="https://www.google.com/maps?q=San%20Francisco&output=embed"
        />
      </Card>
    </>
  );
}

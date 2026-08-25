import { Avatar } from 'primereact/avatar';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';

export default function Profile() {
  return (
    <>
      <PageHeader title="Profile" crumbs={['Pages', 'Profile v1']} />
      <div className="row g-3">
        <div className="col-lg-4">
          <Card>
            <div className="text-center">
              <Avatar
                label="AT"
                shape="circle"
                className="mb-3"
                style={{ background: 'var(--lucid-accent)', color: '#fff', width: 84, height: 84, fontSize: '1.8rem' }}
              />
              <h5 className="fw-bold mb-0" style={{ color: 'var(--lucid-text-strong)' }}>
                Alizee Thomas
              </h5>
              <p className="text-muted small">Product Designer</p>
              <div className="d-flex justify-content-center gap-4 mt-3">
                <div>
                  <div className="fw-bold">128</div>
                  <div className="text-muted small">Posts</div>
                </div>
                <div>
                  <div className="fw-bold">2.4k</div>
                  <div className="text-muted small">Followers</div>
                </div>
                <div>
                  <div className="fw-bold">312</div>
                  <div className="text-muted small">Following</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-lg-8">
          <Card title="About">
            <p className="small text-muted">
              Product designer focused on dashboards and data-dense interfaces. Previously led design
              systems at two Series B startups.
            </p>
            <div className="row g-3 mt-2">
              <div className="col-sm-6">
                <div className="text-muted small">Email</div>
                <div>alizee.thomas@company.com</div>
              </div>
              <div className="col-sm-6">
                <div className="text-muted small">Location</div>
                <div>San Francisco, CA</div>
              </div>
              <div className="col-sm-6">
                <div className="text-muted small">Department</div>
                <div>Design</div>
              </div>
              <div className="col-sm-6">
                <div className="text-muted small">Joined</div>
                <div>Mar 2022</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

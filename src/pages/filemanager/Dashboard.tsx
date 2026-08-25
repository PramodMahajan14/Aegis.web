import { useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { fetchMock } from '../../lib/mockApi';

interface FolderSummary {
  name: string;
  count: string;
  color: string;
}

interface FileEntry {
  name: string;
  size: string;
  icon: string;
  color: string;
}

const folders: FolderSummary[] = [
  { name: 'Design Assets', count: '128 files', color: '#17c9b6' },
  { name: 'Contracts', count: '34 files', color: '#8e6fce' },
  { name: 'Marketing', count: '76 files', color: '#f2a154' },
  { name: 'Engineering', count: '212 files', color: '#3bb6c9' },
];

const files: FileEntry[] = [
  { name: 'Brand-Guidelines.pdf', size: '4.2 MB', icon: 'bi-filetype-pdf', color: '#e15b64' },
  { name: 'Q3-Report.xlsx', size: '1.1 MB', icon: 'bi-filetype-xlsx', color: '#2ecc71' },
  { name: 'Homepage-mockup.fig', size: '8.6 MB', icon: 'bi-vector-pen', color: '#8e6fce' },
  { name: 'team-photo.png', size: '3.4 MB', icon: 'bi-file-image', color: '#3bb6c9' },
  { name: 'Roadmap.docx', size: '540 KB', icon: 'bi-filetype-docx', color: '#5b8def' },
];

export default function FileManagerDashboard() {
  const { data: folderRows = [] } = useQuery({ queryKey: ['file-manager', 'folders'], queryFn: () => fetchMock(folders) });
  const { data: fileRows = [] } = useQuery({ queryKey: ['file-manager', 'files'], queryFn: () => fetchMock(files) });

  return (
    <>
      <PageHeader title="File Manager" crumbs={['File Manager', 'Dashboard']} />

      <div className="row g-3 mb-1">
        <div className="col-md-6">
          <Card>
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: 64 }}>
                <ProgressBar value={64} showValue={false} style={{ height: 8 }} />
                <div className="text-center small fw-bold mt-1">64%</div>
              </div>
              <div>
                <div className="fw-semibold" style={{ color: 'var(--lucid-text-strong)' }}>
                  128 GB of 200 GB used
                </div>
                <div className="text-muted small">72 GB free space remaining</div>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-md-6">
          <Card>
            <Button label="Upload Files" icon="pi pi-upload" className="me-2" />
            <Button label="New Folder" icon="pi pi-folder" outlined />
          </Card>
        </div>
      </div>

      <div className="row g-3">
        {folderRows.map((f) => (
          <div className="col-sm-6 col-xl-3" key={f.name}>
            <div className="lucid-card">
              <div className="lucid-card-body">
                <i className="bi bi-folder-fill fs-2" style={{ color: f.color }} />
                <div className="fw-semibold mt-2" style={{ color: 'var(--lucid-text-strong)' }}>
                  {f.name}
                </div>
                <div className="text-muted small">{f.count}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12">
          <Card title="Recent Files">
            <ul className="list-unstyled mb-0">
              {fileRows.map((f) => (
                <li key={f.name} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                  <span>
                    <i className={'bi ' + f.icon + ' me-2'} style={{ color: f.color }} />
                    {f.name}
                  </span>
                  <span className="text-muted small">{f.size}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

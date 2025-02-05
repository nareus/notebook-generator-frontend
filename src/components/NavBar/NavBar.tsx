import styles from './NavBar.module.scss'
import Button from '@mui/material/Button';
import { NoteAdd, AutoFixHigh} from '@mui/icons-material';
import { useRouter } from 'next/navigation';


export const NavBar = () => {
    const router = useRouter();

    const navigateToAuth = (path: string) => {
      router.push(path);
    };
    return(
        <nav className={styles.topMenu}>
        <div className={styles.logo}>
          Ipython Notebook Generator
        </div>
        <div>
          <Button
            startIcon={<AutoFixHigh />}
            onClick={() => navigateToAuth('/')}
            // className={styles.signInBtn}
          >
            Generate Notebook
          </Button>
          <Button
            startIcon={<NoteAdd />}
            onClick={() => navigateToAuth('/documents')}
            // className={styles.signUpBtn}
          >
            Upload Documents
          </Button>
        </div>
      </nav>
    )
}
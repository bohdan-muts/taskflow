import { User } from 'firebase/auth';

export interface IAuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

export interface IProject {
  id: string;
  title: string;
  inviteKey: string;
  members: string[];
  [key: string]: any;
}

export interface IProjectState {
  selectedProjectId: string | null;
  groupChatProjectId: string | null;
}

export interface IGroupChatMessage{
  id: string;
  text: string;
  senderId: string;
  senderEmail: string;
  timestamp: any;
}

export interface IGroupChatProps {
  projectId: string;
  currentUser: { uid: string; email: string };
}

export interface IUser {
  uid: string;
  email: string;
  displayName: string;
  [key: string]: any;
}

export interface IProjectListProps {
  onSelectProject: (id: string) => void;
  onOpenChat: (id: string) => void;
}

export interface IAuthFormProps {
  title: string;
  buttonText: string;
  onSubmit: (data: {
    email: string;
    password: string;
  }) => void;
  redirectText?: string;
  redirectLink?: string;
  showGoogleLogin?: boolean;
  onGoogleLogin?: () => void;
}
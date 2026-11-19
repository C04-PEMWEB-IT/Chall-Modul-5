// Kontrak bentuk data Post yang disepakati bersama (dipakai Anggota C nanti).
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

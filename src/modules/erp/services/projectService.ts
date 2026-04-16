import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  getDocs, 
  query, 
  where,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { Project } from "../types/project";

const COLLECTION_NAME = "projects";

export const projectService = {
  async getAll(userId: string): Promise<Project[]> {
    if (userId === "guest-user-id") {
      return [
        {
          id: "P001",
          name: "Cozinha Planejada - Loft 42",
          customerName: "Ricardo Santos",
          customerId: "c1",
          status: "Produção",
          progress: 65,
          budget: "R$ 18.500,00",
          deadline: "12/05/2026",
          priority: "Alta",
          userId: "guest-user-id"
        },
        {
          id: "P002",
          name: "Painel Ripado Home Office",
          customerName: "Mariana Lima",
          customerId: "c2",
          status: "Montagem",
          progress: 85,
          budget: "R$ 4.200,00",
          deadline: "20/04/2026",
          priority: "Normal",
          userId: "guest-user-id"
        },
        {
          id: "P003",
          name: "Mesa de Jantar em Angelim",
          customerName: "André Oliveira",
          customerId: "c3",
          status: "Projeto",
          progress: 20,
          budget: "R$ 7.900,00",
          deadline: "05/06/2026",
          priority: "Normal",
          userId: "guest-user-id"
        }
      ] as Project[];
    }

    const q = query(
      collection(db, COLLECTION_NAME), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  },

  async create(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...project,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async update(id: string, project: Partial<Project>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...project,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  async getById(id: string): Promise<Project | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Project;
    }
    return null;
  }
};

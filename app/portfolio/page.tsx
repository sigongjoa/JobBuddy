"use client"

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectGrid } from "@/components/portfolio/project-grid"
import { ProjectTable } from "@/components/portfolio/project-table"
import { FilterBar } from "@/components/portfolio/filter-bar"
import { ProjectFormModal } from "@/components/portfolio/project-form-modal"
import { useAuth } from "@clerk/nextjs"
import CryptoJS from "crypto-js"

export default function PortfolioPage() {
  console.debug("PortfolioPage: function entry");
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]); // 프로젝트 데이터 상태
  const [currentProject, setCurrentProject] = useState<any | null>(null); // 현재 수정 중인 프로젝트
  const [loadedDecryptionKey, setLoadedDecryptionKey] = useState<string | null>(null);
  const [keyLoadingError, setKeyLoadingError] = useState<string | null>(null);

  const loadKey = async () => {
    console.debug("loadKey: function entry (PortfolioPage)");
    if (!isSignedIn) {
      console.warn("loadKey: Not signed in, cannot load key (PortfolioPage).");
      setLoadedDecryptionKey(null);
      setKeyLoadingError("로그인해야 복호화 키를 가져올 수 있습니다.");
      return;
    }
    setKeyLoadingError(null); // Clear previous errors
    try {
      const res = await fetch("/api/getDecryptionKey");
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }
      const { key } = await res.json();
      setLoadedDecryptionKey(key);
      console.debug("loadKey: Key fetched successfully (PortfolioPage).");
    } catch (error: any) {
      console.error("loadKey: Error fetching decryption key (PortfolioPage)", { error });
      setLoadedDecryptionKey(null);
      setKeyLoadingError(`복호화 키를 가져오는 데 실패했습니다: ${error.message}`);
      alert(`복호화 키를 가져오는 데 실패했습니다: ${error.message}`);
    }
    console.debug("loadKey: function exit (PortfolioPage)");
  };

  const loadAndDecryptData = async () => {
    console.debug("loadAndDecryptData: function entry (PortfolioPage)");
    if (!loadedDecryptionKey) {
      console.debug("loadAndDecryptData: Decryption key not available yet (PortfolioPage).");
      return;
    }

    const savedProjects = localStorage.getItem("portfolioProjects");
    if (savedProjects) {
      try {
        const bytes = CryptoJS.AES.decrypt(savedProjects, loadedDecryptionKey);
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);
        if (plaintext) {
          const parsedProjects = JSON.parse(plaintext);
          setProjects(parsedProjects);
          console.debug("PortfolioPage: Projects loaded and decrypted from localStorage", { parsedProjects });
        } else {
          console.warn("PortfolioPage: Decrypted data is empty, removing corrupted data.");
          localStorage.removeItem("portfolioProjects");
          setProjects([]);
        }
      } catch (error) {
        console.error("PortfolioPage: Error parsing or decrypting saved projects from localStorage", { error });
        localStorage.removeItem("portfolioProjects");
        setProjects([]);
        alert("저장된 데이터를 복호화하는 데 실패했습니다. 데이터가 손상되었거나 잘못된 키일 수 있습니다. LocalStorage를 초기화합니다.");
      }
    } else {
      setProjects([]);
      console.debug("PortfolioPage: No saved data in localStorage.");
    }
    console.debug("loadAndDecryptData: function exit (PortfolioPage)");
  };

  const saveAndEncryptData = (data: any[]) => {
    console.debug("saveAndEncryptData: function entry (PortfolioPage)", { data });
    if (!loadedDecryptionKey) {
      console.warn("saveAndEncryptData: Decryption key not available, cannot encrypt data (PortfolioPage).");
      return;
    }

    try {
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), loadedDecryptionKey).toString();
      localStorage.setItem("portfolioProjects", encryptedData);
      console.debug("PortfolioPage: Data encrypted and saved to localStorage.");
    } catch (error) {
      console.error("PortfolioPage: Error encrypting or saving data to localStorage (PortfolioPage)", { error });
      alert("데이터 암호화 및 저장에 실패했습니다.");
    }
    console.debug("saveAndEncryptData: function exit (PortfolioPage)");
  };

  useEffect(() => {
    console.debug("PortfolioPage: useEffect entry (Clerk status check)", { isLoaded, isSignedIn });
    if (isLoaded) {
      if (isSignedIn) {
        loadKey();
      } else {
        setProjects([]);
        setCurrentProject(null);
        setLoadedDecryptionKey(null);
        setKeyLoadingError(null); // Clear error when signed out
        localStorage.removeItem("portfolioProjects");
        console.debug("PortfolioPage: User not signed in, data cleared.");
      }
    }
    console.debug("PortfolioPage: useEffect exit (Clerk status check)");
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    console.debug("PortfolioPage: useEffect entry (loadedDecryptionKey change)", { loadedDecryptionKey });
    if (loadedDecryptionKey) {
      loadAndDecryptData();
    }
    console.debug("PortfolioPage: useEffect exit (loadedDecryptionKey change)");
  }, [loadedDecryptionKey]);

  useEffect(() => {
    console.debug("PortfolioPage: useEffect entry (projects data change)", { projects });
    // Save data only if projects.length > 0 AND decryptionKey is loaded AND user is signed in
    if (projects.length > 0 && loadedDecryptionKey && isLoaded && isSignedIn) {
      saveAndEncryptData(projects);
    } else if (isLoaded && isSignedIn && loadedDecryptionKey && projects.length === 0) {
        // If projects array is explicitly empty and everything else is ready, clear localStorage
        localStorage.removeItem("portfolioProjects");
        console.debug("PortfolioPage: projects array is empty, data cleared from localStorage.");
    }
    console.debug("PortfolioPage: useEffect exit (projects data change)");
  }, [projects, loadedDecryptionKey, isLoaded, isSignedIn]);

  const handleSubmitProject = (projectData: any) => {
    console.debug("PortfolioPage: handleSubmitProject entry", { projectData, currentProject });
    if (currentProject) {
      // Update existing project
      setProjects(projects.map(p => p.id === currentProject.id ? { ...projectData, id: currentProject.id } : p));
      console.debug("PortfolioPage: Project updated");
    } else {
      // Add new project
      const newProject = {
        id: Date.now(), // Simple unique ID
        ...projectData,
      };
      setProjects([...projects, newProject]);
      console.debug("PortfolioPage: New project added", { newProject });
    }
    setIsModalOpen(false);
    setCurrentProject(null); // Reset for next use
    console.debug("PortfolioPage: handleSubmitProject exit");
  };

  const handleEditProject = (project: any) => {
    console.debug("PortfolioPage: handleEditProject entry", { project });
    setCurrentProject(project);
    setIsModalOpen(true);
    console.debug("PortfolioPage: handleEditProject exit");
  };

  const handleDeleteProject = (id: number) => {
    console.debug("PortfolioPage: handleDeleteProject entry", { id });
    setProjects(projects.filter(p => p.id !== id));
    console.debug("PortfolioPage: Project deleted");
  };

  const handleExportJson = () => {
    console.debug("PortfolioPage: handleExportJson entry");
    if (!loadedDecryptionKey || !isSignedIn) {
      alert("로그인해야 데이터를 내보낼 수 있습니다.");
      console.warn("handleExportJson: Not signed in or key not available, cannot export.");
      return;
    }
    const dataStr = JSON.stringify(projects, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio_projects.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.debug("PortfolioPage: JSON exported");
  };

  const handleModalClose = () => {
    console.debug("PortfolioPage: handleModalClose entry");
    setIsModalOpen(false);
    setCurrentProject(null); // Clear current project on close
    console.debug("PortfolioPage: handleModalClose exit");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">포트폴리오 및 피드백</h1>
          <p className="text-muted-foreground">
            프로젝트를 추적하고, 피드백을 수집하며, 개선 진행 상황을 모니터링하세요.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExportJson} variant="outline" disabled={!isSignedIn || !loadedDecryptionKey || projects.length === 0}>
            JSON 내보내기
          </Button>
          <Button onClick={() => {
            console.debug("PortfolioPage: Add project button clicked");
            setIsModalOpen(true);
            setCurrentProject(null); // Ensure no old data in form
          }} disabled={!isSignedIn || !loadedDecryptionKey}>
            <Plus className="mr-2 h-4 w-4" />
            프로젝트 추가
          </Button>
        </div>
      </div>

      <FilterBar />

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">그리드 보기</TabsTrigger>
          <TabsTrigger value="table">테이블 보기</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="space-y-4">
          {!isLoaded ? (
            <p className="text-muted-foreground text-center">인증 정보를 불러오는 중...</p>
          ) : !isSignedIn ? (
            <p className="text-muted-foreground text-center">로그인해야 데이터를 관리할 수 있습니다.</p>
          ) : !loadedDecryptionKey ? (
            keyLoadingError ? (
              <p className="text-destructive text-center">오류: {keyLoadingError}</p>
            ) : (
              <p className="text-muted-foreground text-center">복호화 키를 불러오는 중입니다. 잠시만 기다려 주세요.</p>
            )
          ) : projects.length === 0 ? (
            <p className="text-muted-foreground text-center">아직 프로젝트가 없습니다. 새로운 프로젝트를 추가해보세요.</p>
          ) : (
            <ProjectGrid projects={projects} />
          )}
        </TabsContent>
        <TabsContent value="table" className="space-y-4">
          {!isLoaded ? (
            <p className="text-muted-foreground text-center">인증 정보를 불러오는 중...</p>
          ) : !isSignedIn ? (
            <p className="text-muted-foreground text-center">로그인해야 데이터를 관리할 수 있습니다.</p>
          ) : !loadedDecryptionKey ? (
            keyLoadingError ? (
              <p className="text-destructive text-center">오류: {keyLoadingError}</p>
            ) : (
              <p className="text-muted-foreground text-center">복호화 키를 불러오는 중입니다. 잠시만 기다려 주세요.</p>
            )
          ) : projects.length === 0 ? (
            <p className="text-muted-foreground text-center">아직 프로젝트가 없습니다. 새로운 프로젝트를 추가해보세요.</p>
          ) : (
            <ProjectTable
              projects={projects}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
            />
          )}
        </TabsContent>
      </Tabs>

      <ProjectFormModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        initialData={currentProject}
        onSubmit={handleSubmitProject}
      />
    </div>
  );
}

"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScheduleTable } from "@/components/interviews/schedule-table"
import { CalendarView } from "@/components/interviews/calendar-view"
import { FilterBar } from "@/components/interviews/filter-bar"
import { ScheduleFormModal } from "@/components/interviews/schedule-form-modal"
import { useAuth } from "@clerk/nextjs"
import CryptoJS from "crypto-js"

interface Interview {
  id: number;
  company: string;
  role: string;
  applicationDate: string;
  interviewDate: string;
  type: string;
  status: string;
  nextAction: string;
  feedback: string;
}

export default function InterviewsPage() {
  console.debug("InterviewsPage: function entry");
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [decryptionKey, setDecryptionKey] = useState<string | null>(null);

  const fetchDecryptionKey = async () => {
    console.debug("fetchDecryptionKey: function entry (InterviewsPage)");
    if (!isSignedIn) {
      console.warn("fetchDecryptionKey: Not signed in, cannot fetch key (InterviewsPage).");
      setDecryptionKey(null);
      return;
    }
    try {
      const res = await fetch("/api/getKey");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`키를 가져올 수 없습니다: ${errorData.error || res.statusText}`);
      }
      const data = await res.json();
      setDecryptionKey(data.key);
      console.debug("fetchDecryptionKey: Key fetched successfully (InterviewsPage).");
    } catch (error) {
      console.error("fetchDecryptionKey: Error fetching decryption key (InterviewsPage)", { error });
      setDecryptionKey(null);
      alert(`복호화 키를 가져오는 데 실패했습니다: ${error.message}`);
    }
    console.debug("fetchDecryptionKey: function exit (InterviewsPage)");
  };

  const loadAndDecryptData = async () => {
    console.debug("loadAndDecryptData: function entry (InterviewsPage)");
    if (!decryptionKey) {
      console.debug("loadAndDecryptData: Decryption key not available yet (InterviewsPage).");
      return;
    }

    const savedInterviews = localStorage.getItem("jobInterviews");
    if (savedInterviews) {
      try {
        const bytes = CryptoJS.AES.decrypt(savedInterviews, decryptionKey);
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);
        if (plaintext) {
          const parsedInterviews = JSON.parse(plaintext);
          setInterviews(parsedInterviews);
          console.debug("InterviewsPage: Interviews loaded and decrypted from localStorage", { parsedInterviews });
        } else {
          console.warn("InterviewsPage: Decrypted data is empty, removing corrupted data.");
          localStorage.removeItem("jobInterviews");
          setInterviews([]);
        }
      } catch (error) {
        console.error("InterviewsPage: Error parsing or decrypting saved interviews from localStorage", { error });
        localStorage.removeItem("jobInterviews");
        setInterviews([]);
      }
    } else {
      setInterviews([]);
      console.debug("InterviewsPage: No saved data in localStorage.");
    }
    console.debug("loadAndDecryptData: function exit (InterviewsPage)");
  };

  const saveAndEncryptData = (data: Interview[]) => {
    console.debug("saveAndEncryptData: function entry (InterviewsPage)", { data });
    if (!decryptionKey) {
      console.warn("saveAndEncryptData: Decryption key not available, cannot encrypt data (InterviewsPage).");
      return;
    }

    try {
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), decryptionKey).toString();
      localStorage.setItem("jobInterviews", encryptedData);
      console.debug("InterviewsPage: Data encrypted and saved to localStorage.");
    } catch (error) {
      console.error("InterviewsPage: Error encrypting or saving data to localStorage (InterviewsPage)", { error });
    }
    console.debug("saveAndEncryptData: function exit (InterviewsPage)");
  };

  useEffect(() => {
    console.debug("InterviewsPage: useEffect entry (Clerk status check)", { isLoaded, isSignedIn });
    if (isLoaded && isSignedIn) {
      fetchDecryptionKey();
    } else if (isLoaded && !isSignedIn) {
      setInterviews([]);
      setDecryptionKey(null);
      localStorage.removeItem("jobInterviews");
      console.debug("InterviewsPage: User not signed in, data cleared.");
    }
    console.debug("InterviewsPage: useEffect exit (Clerk status check)");
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    console.debug("InterviewsPage: useEffect entry (decryptionKey change)", { decryptionKey });
    if (decryptionKey) {
      loadAndDecryptData();
    }
    console.debug("InterviewsPage: useEffect exit (decryptionKey change)");
  }, [decryptionKey]);

  useEffect(() => {
    console.debug("InterviewsPage: useEffect entry (interviews data change)", { interviews });
    if (interviews.length > 0) {
      saveAndEncryptData(interviews);
    } else if (isLoaded && isSignedIn && decryptionKey) {
      localStorage.removeItem("jobInterviews");
      console.debug("InterviewsPage: interviews array is empty, data cleared from localStorage.");
    }
    console.debug("InterviewsPage: useEffect exit (interviews data change)");
  }, [interviews, decryptionKey, isLoaded, isSignedIn]);

  const addInterview = (newInterview: Omit<Interview, 'id'>) => {
    console.debug("InterviewsPage: addInterview entry", { newInterview });
    setInterviews((prevInterviews) => {
      const newId = prevInterviews.length > 0 ? Math.max(...prevInterviews.map(i => i.id)) + 1 : 1;
      const updatedInterviews = [...prevInterviews, { id: newId, ...newInterview }];
      console.debug("InterviewsPage: New interview added", { newInterview, updatedInterviews });
      return updatedInterviews;
    });
    console.debug("InterviewsPage: addInterview exit");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">면접 일정</h1>
          <p className="text-muted-foreground">면접 일정을 관리하고 지원 진행 상황을 추적하세요.</p>
        </div>
        <Button onClick={() => {
          console.debug("InterviewsPage: Add interview button clicked");
          setIsModalOpen(true);
        }} disabled={!isSignedIn || !decryptionKey}>
          <Plus className="mr-2 h-4 w-4" />
          면접 추가
        </Button>
      </div>

      <FilterBar />

      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">테이블 보기</TabsTrigger>
          <TabsTrigger value="calendar">달력 보기</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="space-y-4">
          {!isLoaded ? (
            <p className="text-muted-foreground text-center">인증 정보를 불러오는 중...</p>
          ) : !isSignedIn ? (
            <p className="text-muted-foreground text-center">로그인해야 데이터를 관리할 수 있습니다.</p>
          ) : !decryptionKey ? (
            <p className="text-muted-foreground text-center">복호화 키를 불러오는 중입니다. 잠시만 기다려 주세요.</p>
          ) : interviews.length === 0 ? (
            <p className="text-muted-foreground text-center">표시할 면접 정보가 없습니다. 새로운 면접을 추가해보세요.</p>
          ) : (
            <ScheduleTable interviews={interviews} />
          )}
        </TabsContent>
        <TabsContent value="calendar" className="space-y-4">
          {!isLoaded ? (
            <p className="text-muted-foreground text-center">인증 정보를 불러오는 중...</p>
          ) : !isSignedIn ? (
            <p className="text-muted-foreground text-center">로그인해야 데이터를 관리할 수 있습니다.</p>
          ) : !decryptionKey ? (
            <p className="text-muted-foreground text-center">복호화 키를 불러오는 중입니다. 잠시만 기다려 주세요.</p>
          ) : interviews.length === 0 ? (
            <p className="text-muted-foreground text-center">표시할 면접 정보가 없습니다. 새로운 면접을 추가해보세요.</p>
          ) : (
            <CalendarView />
          )}
        </TabsContent>
      </Tabs>

      <ScheduleFormModal open={isModalOpen} onOpenChange={setIsModalOpen} onAddInterview={addInterview} />
    </div>
  );
}

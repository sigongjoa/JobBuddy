"use client"

import { Star, Calendar, Plus, Edit, Trash2 } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@clerk/nextjs"; // Clerk의 useAuth 훅 임포트
import CryptoJS from "crypto-js"; // crypto-js 임포트

interface Feedback {
  id: number
  source: string
  comment: string
  date: string
  rating: number
  companyName?: string; // Add optional companyName field
}

interface FeedbackListProps {
  // feedback: Feedback[] // Removed feedback prop, as it will manage its own state
}

export function FeedbackList({ /* feedback */ }: FeedbackListProps) {
  console.debug("FeedbackList: function entry");
  const { userId, isLoaded, isSignedIn } = useAuth(); // Clerk 인증 훅 사용
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [companies, setCompanies] = useState<string[]>([]); // State for company names
  const [loadedDecryptionKey, setLoadedDecryptionKey] = useState<string | null>(null);
  const [keyLoadingError, setKeyLoadingError] = useState<string | null>(null);

  // 복호화 키를 가져오는 함수
  const loadKey = async () => {
    console.debug("loadKey: function entry (FeedbackList)");
    if (!isSignedIn) {
      console.warn("loadKey: Not signed in, cannot load key (FeedbackList).");
      setLoadedDecryptionKey(null);
      setKeyLoadingError("로그인해야 복호화 키를 가져올 수 있습니다.");
      return;
    }
    setKeyLoadingError(null); // Clear previous errors
    try {
      const res = await fetch("/api/getDecryptionKey");
      if (!res.ok) {
        // 에러일 땐 text() 로 읽어서 메시지로 던집니다
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }
      // 성공일 땐 JSON으로 파싱
      const { key } = await res.json();

      setLoadedDecryptionKey(key);
      console.debug("loadKey: Key fetched successfully (FeedbackList).");
    } catch (error: any) {
      console.error("loadKey: Error fetching decryption key (FeedbackList)", { error });
      setLoadedDecryptionKey(null);
      setKeyLoadingError(`복호화 키를 가져오는 데 실패했습니다: ${error.message}`);
      alert(`복호화 키를 가져오는 데 실패했습니다: ${error.message}`);
    }
    console.debug("loadKey: function exit (FeedbackList)");
  };

  // 피드백 데이터 로드 및 복호화 함수
  const loadAndDecryptFeedbacks = async () => {
    console.debug("loadAndDecryptFeedbacks: function entry (FeedbackList)");
    if (!loadedDecryptionKey) {
      console.debug("loadAndDecryptFeedbacks: Decryption key not available yet (FeedbackList).");
      return;
    }

    const savedFeedbacks = localStorage.getItem("portfolioFeedbacks");
    if (savedFeedbacks) {
      try {
        const bytes = CryptoJS.AES.decrypt(savedFeedbacks, loadedDecryptionKey);
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);
        if (plaintext) {
          const parsedFeedbacks = JSON.parse(plaintext);
          setFeedbacks(parsedFeedbacks);
          console.debug("FeedbackList: Feedbacks loaded and decrypted from localStorage", { parsedFeedbacks });
        } else {
          console.warn("FeedbackList: Decrypted feedback data is empty, removing corrupted data.");
          localStorage.removeItem("portfolioFeedbacks");
          setFeedbacks([]);
        }
      } catch (error) {
        console.error("FeedbackList: Error parsing or decrypting saved feedbacks from localStorage", { error });
        localStorage.removeItem("portfolioFeedbacks"); // 잘못된 데이터 삭제
        setFeedbacks([]);
        alert("저장된 피드백 데이터를 복호화하는 데 실패했습니다. 데이터가 손상되었거나 잘못된 키일 수 있습니다. LocalStorage를 초기화합니다.");
      }
    } else {
      setFeedbacks([]);
      console.debug("FeedbackList: No saved feedbacks in localStorage.");
    }
    console.debug("loadAndDecryptFeedbacks: function exit (FeedbackList)");
  };

  // 회사 데이터 로드 및 복호화 함수 (feedback-list에서 필요)
  const loadAndDecryptCompanies = async () => {
    console.debug("loadAndDecryptCompanies: function entry (FeedbackList)");
    if (!loadedDecryptionKey) {
      console.debug("loadAndDecryptCompanies: Decryption key not available yet (FeedbackList).");
      return;
    }

    const savedCompanyData = localStorage.getItem("companyAnalysisData");
    if (savedCompanyData) {
      try {
        const bytes = CryptoJS.AES.decrypt(savedCompanyData, loadedDecryptionKey);
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);
        if (plaintext) {
          const parsedCompanyData = JSON.parse(plaintext);
          if (parsedCompanyData && Array.isArray(parsedCompanyData.companyResearch)) {
            const companyNames = parsedCompanyData.companyResearch.map((company: any) => company.company);
            setCompanies(companyNames);
            console.debug("FeedbackList: Company names loaded and decrypted from localStorage", { companyNames });
          } else {
            console.warn("FeedbackList: Decrypted company data is not in expected format or empty.");
            setCompanies([]);
          }
        } else {
          console.warn("FeedbackList: Decrypted company data is empty.");
          setCompanies([]);
        }
      } catch (error) {
        console.error("FeedbackList: Error parsing or decrypting company data from localStorage", { error });
        setCompanies([]);
        alert("저장된 회사 데이터를 복호화하는 데 실패했습니다. 데이터가 손상되었거나 잘못된 키일 수 있습니다.");
      }
    } else {
      setCompanies([]);
      console.debug("FeedbackList: No saved company data in localStorage.");
    }
    console.debug("loadAndDecryptCompanies: function exit (FeedbackList)");
  };

  // 데이터 암호화 및 저장 함수
  const saveAndEncryptFeedbacks = (data: Feedback[]) => {
    console.debug("saveAndEncryptFeedbacks: function entry (FeedbackList)", { data });
    if (!loadedDecryptionKey) {
      console.warn("saveAndEncryptFeedbacks: Decryption key not available, cannot encrypt data (FeedbackList).");
      return;
    }

    try {
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), loadedDecryptionKey).toString();
      localStorage.setItem("portfolioFeedbacks", encryptedData);
      console.debug("FeedbackList: Feedbacks encrypted and saved to localStorage.");
    } catch (error) {
      console.error("FeedbackList: Error encrypting or saving feedbacks to localStorage (FeedbackList)", { error });
      alert("피드백 암호화 및 저장에 실패했습니다.");
    }
    console.debug("saveAndEncryptFeedbacks: function exit (FeedbackList)");
  };

  // Clerk 인증 상태가 로드되고 로그인 상태일 때 키를 가져옴
  useEffect(() => {
    console.debug("FeedbackList: useEffect entry (Clerk status check)", { isLoaded, isSignedIn });
    if (isLoaded) {
      if (isSignedIn) {
        loadKey();
      } else {
        // 로그아웃 상태일 때 데이터 초기화
        setFeedbacks([]);
        setCurrentFeedback(null);
        setCompanies([]);
        setLoadedDecryptionKey(null);
        setKeyLoadingError(null); // Clear error when signed out
        localStorage.removeItem("portfolioFeedbacks");
        localStorage.removeItem("companyAnalysisData"); // 회사 데이터도 초기화
        console.debug("FeedbackList: User not signed in, data cleared.");
      }
    }
    console.debug("FeedbackList: useEffect exit (Clerk status check)");
  }, [isLoaded, isSignedIn]);

  // 복호화 키가 변경되면 피드백 데이터와 회사 데이터를 로드 및 복호화
  useEffect(() => {
    console.debug("FeedbackList: useEffect entry (loadedDecryptionKey change)", { loadedDecryptionKey });
    if (loadedDecryptionKey) {
      loadAndDecryptFeedbacks();
      loadAndDecryptCompanies();
    }
    console.debug("FeedbackList: useEffect exit (loadedDecryptionKey change)");
  }, [loadedDecryptionKey]);

  // feedbacks 데이터가 변경될 때마다 localStorage에 암호화하여 저장
  useEffect(() => {
    console.debug("FeedbackList: useEffect entry (feedbacks data change)", { feedbacks });
    if (feedbacks.length > 0 && loadedDecryptionKey && isLoaded && isSignedIn) {
      saveAndEncryptFeedbacks(feedbacks);
    } else if (isLoaded && isSignedIn && loadedDecryptionKey && feedbacks.length === 0) { // feedbacks가 비어있고, 로그인 및 키가 있을 때만 localStorage에서도 제거
        localStorage.removeItem("portfolioFeedbacks");
        console.debug("FeedbackList: feedbacks array is empty, data cleared from localStorage.");
    }
    console.debug("FeedbackList: useEffect exit (feedbacks data change)");
  }, [feedbacks, loadedDecryptionKey, isLoaded, isSignedIn]);

  const handleAddOrUpdateFeedback = (feedbackData: Omit<Feedback, 'id'>) => {
    console.debug("FeedbackList: handleAddOrUpdateFeedback entry", { feedbackData, currentFeedback });
    if (currentFeedback) {
      // Update existing feedback
      setFeedbacks(feedbacks.map(f => f.id === currentFeedback.id ? { ...feedbackData, id: currentFeedback.id } : f));
      console.debug("FeedbackList: Feedback updated");
    } else {
      // Add new feedback
      const newFeedback: Feedback = {
        id: Date.now(), // Simple unique ID
        ...feedbackData,
      };
      setFeedbacks([...feedbacks, newFeedback]);
      console.debug("FeedbackList: New feedback added", { newFeedback });
    }
    setIsModalOpen(false);
    setCurrentFeedback(null); // Reset for next use
    console.debug("FeedbackList: handleAddOrUpdateFeedback exit");
  };

  const handleDeleteFeedback = (id: number) => {
    console.debug("FeedbackList: handleDeleteFeedback entry", { id });
    setFeedbacks(feedbacks.filter(f => f.id !== id));
    console.debug("FeedbackList: Feedback deleted");
  };

  const openEditModal = (feedback: Feedback) => {
    console.debug("FeedbackList: openEditModal entry", { feedback });
    setCurrentFeedback(feedback);
    setIsModalOpen(true);
    console.debug("FeedbackList: openEditModal exit");
  };

  const handleModalClose = () => {
    console.debug("FeedbackList: handleModalClose entry");
    setIsModalOpen(false);
    setCurrentFeedback(null); // Clear current feedback on close
    console.debug("FeedbackList: handleModalClose exit");
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => {
        console.debug("FeedbackList: Add feedback button clicked");
        setIsModalOpen(true);
        setCurrentFeedback(null); // Ensure no old data in form
      }} disabled={!isSignedIn || !loadedDecryptionKey}>
        <Plus className="mr-2 h-4 w-4" />
        피드백 추가
      </Button>

      <div className="space-y-2">
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
        ) : feedbacks.length === 0 ? (
          <p className="text-muted-foreground">아직 피드백이 없습니다. 새로운 피드백을 추가해보세요.</p>
        ) : (
          feedbacks.map((item) => (
            <Collapsible key={item.id}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-transparent p-3 h-auto">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(item.rating)}</div>
                    <span className="text-sm font-medium">{item.source} {item.companyName && `(${item.companyName})`}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="text-xs">{item.date}</Badge>
                    <span
                      onClick={(e) => {
                        console.debug("FeedbackList: Edit button clicked", { id: item.id });
                        e.stopPropagation(); // Prevent collapsible from toggling
                        openEditModal(item);
                      }}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </span>
                    <span
                      onClick={(e) => {
                        console.debug("FeedbackList: Delete button clicked", { id: item.id });
                        e.stopPropagation(); // Prevent collapsible from toggling
                        handleDeleteFeedback(item.id);
                      }}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 hover:bg-accent hover:text-accent-foreground text-red-500 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </span>
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="p-3 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">{item.comment}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {item.date}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentFeedback ? "피드백 수정" : "피드백 추가"}</DialogTitle>
            <DialogDescription>
              {currentFeedback ? "선택한 피드백을 수정합니다." : "새로운 피드백을 추가합니다."}
            </DialogDescription>
          </DialogHeader>
          <FeedbackForm
            initialData={currentFeedback}
            onSubmit={handleAddOrUpdateFeedback}
            isEditing={!!currentFeedback}
            availableCompanies={companies} // Pass company names to FeedbackForm
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Separate FeedbackForm component for reusability and clarity
interface FeedbackFormProps {
  initialData?: Omit<Feedback, 'id'> | null;
  onSubmit: (data: Omit<Feedback, 'id'>) => void;
  isEditing: boolean;
  availableCompanies: string[]; // New prop for available company names
}

function FeedbackForm({ initialData, onSubmit, isEditing, availableCompanies }: FeedbackFormProps) {
  console.debug("FeedbackForm: function entry", { initialData });
  const [source, setSource] = useState(initialData?.source || "");
  const [comment, setComment] = useState(initialData?.comment || "");
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]); // YYYY-MM-DD format
  const [selectedCompany, setSelectedCompany] = useState<string | null>(initialData?.companyName || null); // State for selected company
  const [useCompanySelect, setUseCompanySelect] = useState<boolean>(!!initialData?.companyName); // State to toggle between text input and select

  useEffect(() => {
    if (initialData) {
      setSource(initialData.source || "");
      setComment(initialData.comment || "");
      setRating(initialData.rating || 0);
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setSelectedCompany(initialData.companyName || null);
      setUseCompanySelect(!!initialData.companyName);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.debug("FeedbackForm: handleSubmit entry");

    let finalSource = source;
    let finalCompanyName: string | undefined = undefined;

    if (useCompanySelect && selectedCompany) {
      finalSource = `회사: ${selectedCompany}`;
      finalCompanyName = selectedCompany;
    } else if (useCompanySelect && !selectedCompany) {
      alert("회사를 선택해주세요.");
      console.debug("FeedbackForm: Company not selected");
      return;
    } else if (!source) {
      alert("출처를 입력해주세요.");
      console.debug("FeedbackForm: Source not entered");
      return;
    }

    if (!comment || rating === 0) {
      alert("모든 필드를 채워주세요 (내용, 별점).");
      console.debug("FeedbackForm: Validation failed");
      return;
    }

    onSubmit({ source: finalSource, comment, date, rating, companyName: finalCompanyName });
    console.debug("FeedbackForm: handleSubmit exit");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div>
        <Label htmlFor="source">출처</Label>
        <div className="flex items-center space-x-2 mt-1">
          <Button
            type="button"
            onClick={() => {
              console.debug("FeedbackForm: Toggle source input type button clicked");
              setUseCompanySelect(!useCompanySelect);
              setSource(""); // Clear text source when switching to select
              setSelectedCompany(null); // Clear selected company when switching to text
            }}
            variant="outline"
            size="sm"
          >
            {useCompanySelect ? "직접 입력" : "회사 목록 선택"}
          </Button>
          {useCompanySelect ? (
            <Select onValueChange={(value) => {
                console.debug("FeedbackForm: Company selected", { value });
                setSelectedCompany(value);
            }} value={selectedCompany || ""}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="회사 선택" />
              </SelectTrigger>
              <SelectContent>
                {availableCompanies.length > 0 ? (availableCompanies.map((company) => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))) : (
                  <div className="p-2 text-muted-foreground">등록된 회사가 없습니다.</div>
                )}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="source"
              placeholder="예: 면접관 A, 동료 B"
              value={source}
              onChange={(e) => {
                console.debug("FeedbackForm: Source input changed", { value: e.target.value });
                setSource(e.target.value);
              }}
            />
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="comment">내용</Label>
        <Textarea
          id="comment"
          placeholder="피드백 내용을 입력하세요."
          value={comment}
          onChange={(e) => {
            console.debug("FeedbackForm: Comment input changed", { value: e.target.value });
            setComment(e.target.value);
          }}
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="rating">별점</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              onClick={() => {
                console.debug("FeedbackForm: Rating star clicked", { star });
                setRating(star);
              }}
            />
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="date">날짜</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => {
            console.debug("FeedbackForm: Date input changed", { value: e.target.value });
            setDate(e.target.value);
          }}
        />
      </div>
      <DialogFooter>
        <Button type="submit">
          {isEditing ? "피드백 수정" : "피드백 추가"}
        </Button>
      </DialogFooter>
    </form>
  );
}

const renderStars = (rating: number) => {
  console.debug("renderStars: function entry", { rating });
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-4 w-4 ${rating > i ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    );
  }
  console.debug("renderStars: function exit", { starsCount: stars.length });
  return stars;
};

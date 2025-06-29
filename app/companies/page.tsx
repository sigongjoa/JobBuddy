"use client"

import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CompanyGrid } from "@/components/companies/company-grid";
import { CompanyTable } from "@/components/companies/company-table";
import { useAuth } from "@clerk/nextjs";
import CryptoJS from "crypto-js";

export default function CompaniesPage() {
  console.log("CompaniesPage: function entry");
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [jsonData, setJsonData] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [decryptionKey, setDecryptionKey] = useState<string | null>(null);

  const fetchDecryptionKey = async () => {
    console.debug("fetchDecryptionKey: function entry");
    if (!isSignedIn) {
      console.warn("fetchDecryptionKey: Not signed in, cannot fetch key.");
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
      console.debug("fetchDecryptionKey: Key fetched successfully.");
    } catch (error) {
      console.error("fetchDecryptionKey: Error fetching decryption key", { error });
      setDecryptionKey(null);
      alert(`복호화 키를 가져오는 데 실패했습니다: ${error.message}`);
    }
    console.debug("fetchDecryptionKey: function exit");
  };

  const loadAndDecryptData = async () => {
    console.debug("loadAndDecryptData: function entry");
    if (!decryptionKey) {
      console.debug("loadAndDecryptData: Decryption key not available yet.");
      return;
    }

    const savedData = localStorage.getItem("companyAnalysisData");
    if (savedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(savedData, decryptionKey);
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);
        if (plaintext) {
          const parsedData = JSON.parse(plaintext);
          setJsonData(parsedData);
          console.debug("CompaniesPage: Data loaded and decrypted from localStorage", { parsedData });
        } else {
          console.warn("CompaniesPage: Decrypted data is empty, removing corrupted data.");
          localStorage.removeItem("companyAnalysisData");
          setJsonData(null);
        }
      } catch (error) {
        console.error("CompaniesPage: Error parsing or decrypting saved data from localStorage", { error });
        localStorage.removeItem("companyAnalysisData");
        setJsonData(null);
      }
    } else {
      setJsonData(null);
      console.debug("CompaniesPage: No saved data in localStorage.");
    }
    console.debug("loadAndDecryptData: function exit");
  };

  const saveAndEncryptData = (data: any) => {
    console.debug("saveAndEncryptData: function entry", { data });
    if (!decryptionKey) {
      console.warn("saveAndEncryptData: Decryption key not available, cannot encrypt data.");
      return;
    }

    try {
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), decryptionKey).toString();
      localStorage.setItem("companyAnalysisData", encryptedData);
      console.debug("CompaniesPage: Data encrypted and saved to localStorage.");
    } catch (error) {
      console.error("CompaniesPage: Error encrypting or saving data to localStorage", { error });
    }
    console.debug("saveAndEncryptData: function exit");
  };

  useEffect(() => {
    console.debug("CompaniesPage: useEffect entry (Clerk status check)", { isLoaded, isSignedIn });
    if (isLoaded && isSignedIn) {
      fetchDecryptionKey();
    } else if (isLoaded && !isSignedIn) {
      setJsonData(null);
      setDecryptionKey(null);
      localStorage.removeItem("companyAnalysisData");
      console.debug("CompaniesPage: User not signed in, data cleared.");
    }
    console.debug("CompaniesPage: useEffect exit (Clerk status check)");
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    console.debug("CompaniesPage: useEffect entry (decryptionKey change)", { decryptionKey });
    if (decryptionKey) {
      loadAndDecryptData();
    }
    console.debug("CompaniesPage: useEffect exit (decryptionKey change)");
  }, [decryptionKey]);

  useEffect(() => {
    console.debug("CompaniesPage: useEffect entry (jsonData change)", { jsonData });
    if (jsonData) {
      saveAndEncryptData(jsonData);
    } else if (isLoaded && isSignedIn && decryptionKey) {
        localStorage.removeItem("companyAnalysisData");
        console.debug("CompaniesPage: jsonData is null, data cleared from localStorage.");
    }
    console.debug("CompaniesPage: useEffect exit (jsonData change)");
  }, [jsonData, decryptionKey, isLoaded, isSignedIn]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    console.debug("handleFileUpload: function entry");
    const file = event.target.files?.[0];
    if (file) {
      console.debug("handleFileUpload: file selected", { fileName: file.name });
      const reader = new FileReader();
      reader.onload = (e) => {
        console.debug("handleFileUpload: file loaded");
        try {
          const parsedData = JSON.parse(e.target?.result as string);
          setJsonData(parsedData);
          console.debug("handleFileUpload: JSON data parsed and set to state", { parsedData });
        } catch (error) {
          console.error("handleFileUpload: Error parsing JSON", { error });
          alert("유효한 JSON 파일이 아닙니다.");
          setJsonData(null);
        }
      };
      reader.readAsText(file);
    } else {
      console.debug("handleFileUpload: No file selected.");
    }
    console.debug("handleFileUpload: function exit");
  };

  const openDetail = (item: any, associatedJobs: any[] = []) => {
    console.debug("openDetail: function entry", { item, associatedJobs });
    setSelectedItem({ ...item, associatedJobs });
    setIsDetailOpen(true);
    console.debug("openDetail: function exit");
  };

  const companiesToDisplay = jsonData?.companyResearch || [];
  const practicalChecklistExamplesToDisplay = jsonData?.practicalChecklistExamples || [];

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold tracking-tight mb-8">회사 조사 및 채용공고 분석 가이드</h1>

      <div className="mb-8 flex items-center space-x-2">
        <Input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          ref={fileInputRef}
          className="max-w-xs"
          disabled={!isSignedIn || !decryptionKey}
        />
        <Button onClick={() => {
            console.debug("Clear data button clicked");
            setJsonData(null);
            setSelectedItem(null);
            setIsDetailOpen(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            localStorage.removeItem("companyAnalysisData");
            console.debug("jsonData cleared");
        }} disabled={!isSignedIn || !decryptionKey}>
          데이터 초기화
        </Button>
      </div>

      {!isLoaded ? (
        <p className="text-muted-foreground mt-4 text-center">인증 정보를 불러오는 중...</p>
      ) : !isSignedIn ? (
        <p className="text-muted-foreground mt-4 text-center">로그인해야 데이터를 관리할 수 있습니다.</p>
      ) : !decryptionKey ? (
        <p className="text-muted-foreground mt-4 text-center">복호화 키를 불러오는 중입니다. 잠시만 기다려 주세요.</p>
      ) : jsonData ? (
        <div className="space-y-10">
          {companiesToDisplay.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>회사별 상세 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  <CompanyGrid companies={companiesToDisplay.map((c: any) => ({
                      id: Date.now() + Math.random(),
                      name: c.company,
                      industry: c.businessProductsServices?.description || '',
                      size: '',
                      culture: c.cultureAndBenefits?.benefits || [],
                      salaryRange: '',
                      preparationStatus: 0,
                      skillMatch: 0,
                      location: '',
                      website: '',
                      lastUpdated: '',
                      notes: '',
                  }))} />
                </div>
                <div className="mt-8">
                  <CompanyTable companies={companiesToDisplay.map((c: any) => ({
                      id: Date.now() + Math.random(),
                      name: c.company,
                      industry: c.businessProductsServices?.description || '',
                      size: '',
                      location: '',
                      salaryRange: '',
                      preparationStatus: 0,
                      skillMatch: 0,
                      lastUpdated: '',
                  }))} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <p className="text-muted-foreground mt-4">
              표시할 회사 조사 데이터가 없습니다. JSON 파일을 업로드하거나, 'companyResearch' 섹션을 확인하세요.
            </p>
          )}

          {practicalChecklistExamplesToDisplay.length > 0 ? (
            <Card className="mt-10">
              <CardHeader>
                <CardTitle>✔️ 실전 체크리스트 예시</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">구분</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">항목</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">내 매칭 여부 / 메모</th>
                      </tr>
                    </thead>
                    <tbody>
                      {practicalChecklistExamplesToDisplay.map((item: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2 text-sm text-gray-800">{item.item}</td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            {Array.isArray(item.detail) ? item.detail.join(", ") :
                             typeof item.detail === 'object' && item.detail !== null
                               ? Object.entries(item.detail).map(([key, value]) => `${key}: ${String(value)}`).join(", ")
                               : String(item.detail)
                            }
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            {typeof item.match === 'boolean' ? (item.match ? '✔️' : '🚫') :
                             typeof item.match === 'object' ? Object.entries(item.match).map(([key, value]) => (
                                <span key={key}>
                                  {key}: {value ? '✔️' : '🚫'}
                                </span>
                             )) : item.match}
                            {item.note && ` ${item.note}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p className="text-muted-foreground mt-4">
              표시할 실전 체크리스트 예시가 없습니다. JSON 파일을 업로드하거나, 'practicalChecklistExamples' 섹션을 확인하세요.
            </p>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground mt-4">
          JSON 파일을 업로드하여 회사 조사 및 채용공고 분석 데이터를 확인하세요.
        </p>
      )}

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[800px] p-6">
          <DialogHeader>
            <DialogTitle>{selectedItem?.company} 상세 정보</DialogTitle>
            <DialogDescription>
              {selectedItem?.company}에 대한 자세한 회사 및 채용공고 데이터를 확인합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6 max-h-[80vh] overflow-y-auto">
            {selectedItem && (
              <section>
                <h3 className="text-xl font-semibold border-b pb-1 mb-2">회사 분석</h3>
                <div className="space-y-4">
                  {selectedItem.visionMissionValues && (
                    <div>
                      <h4 className="text-lg font-semibold">비전·미션·가치관</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {selectedItem.visionMissionValues.description && <li>{selectedItem.visionMissionValues.description}</li>}
                        {selectedItem.visionMissionValues.alignment && <li>본인 커리어 목표와 일치 여부: {selectedItem.visionMissionValues.alignment}</li>}
                      </ul>
                    </div>
                  )}
                  {selectedItem.businessProductsServices && (
                    <div>
                      <h4 className="text-lg font-semibold">사업 분야·제품·서비스</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {selectedItem.businessProductsServices.description && <li>{selectedItem.businessProductsServices.description}</li>}
                        {selectedItem.businessProductsServices.marketShare && <li>시장 점유율: {selectedItem.businessProductsServices.marketShare}</li>}
                      </ul>
                    </div>
                  )}
                  {selectedItem.financialHealthAndGrowth && (
                    <div>
                      <h4 className="text-lg font-semibold">재무 건전성 및 성장성</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {selectedItem.financialHealthAndGrowth.description && <li>{selectedItem.financialHealthAndGrowth.description}</li>}
                        {selectedItem.financialHealthAndGrowth.stability && <li>안정성: {selectedItem.financialHealthAndGrowth.stability}</li>}
                      </ul>
                    </div>
                  )}
                  {selectedItem.cultureAndBenefits && (
                    <div>
                      <h4 className="text-lg font-semibold">조직 문화 및 복리후생</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {selectedItem.cultureAndBenefits.reviewsScore && <li>리뷰 점수: {selectedItem.cultureAndBenefits.reviewsScore}</li>}
                        {selectedItem.cultureAndBenefits.benefits && Array.isArray(selectedItem.cultureAndBenefits.benefits) && (
                          <li>복리후생: {selectedItem.cultureAndBenefits.benefits.join(", ")}</li>
                        )}
                      </ul>
                    </div>
                  )}
                  {selectedItem.techStackAndProcess && (
                    <div>
                      <h4 className="text-lg font-semibold">기술 스택 및 개발 프로세스</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {selectedItem.techStackAndProcess.stack && Array.isArray(selectedItem.techStackAndProcess.stack) && (
                          <li>기술 스택: {selectedItem.techStackAndProcess.stack.join(", ")}</li>
                        )}
                        {selectedItem.techStackAndProcess.process && <li>개발 프로세스: {selectedItem.techStackAndProcess.process}</li>}
                      </ul>
                    </div>
                  )}
                  {selectedItem.competitorsAndIndustryTrends && (
                    <div>
                      <h4 className="text-lg font-semibold">경쟁사 및 산업 동향 분석</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {selectedItem.competitorsAndIndustryTrends.competitors && Array.isArray(selectedItem.competitorsAndIndustryTrends.competitors) && (
                          <li>경쟁사: {selectedItem.competitorsAndIndustryTrends.competitors.join(", ")}</li>
                        )}
                        {selectedItem.competitorsAndIndustryTrends.trends && <li>산업 동향: {selectedItem.competitorsAndIndustryTrends.trends}</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {selectedItem?.associatedJobs && selectedItem.associatedJobs.length > 0 ? (
              <section className="mt-6">
                <h3 className="text-xl font-semibold border-b pb-1 mb-2">관련 채용공고 분석</h3>
                <div className="space-y-4">
                  {selectedItem.associatedJobs.map((jobData: any, jobIdx: number) => (
                    <div key={jobIdx} className="border p-3 rounded-md">
                      <h4 className="text-lg font-semibold mb-1">직무: {jobData.title} {jobData.type && `(${jobData.type})`}</h4>
                      {jobData.responsibilities && jobData.responsibilities.length > 0 && (
                        <div>
                          <p className="font-semibold">주요 업무:</p>
                          <ul className="list-disc list-inside ml-4 text-muted-foreground">
                            {jobData.responsibilities.map((res: string, resIdx: number) => (
                              <li key={resIdx}>{res}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {jobData.qualifications && jobData.qualifications.length > 0 && (
                        <div>
                          <p className="font-semibold mt-2">자격 요건:</p>
                          <ul className="list-disc list-inside ml-4 text-muted-foreground">
                            {jobData.qualifications.map((qual: string, qualIdx: number) => (
                              <li key={qualIdx}>{qual}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {jobData.applicationProcess && jobData.applicationProcess.length > 0 && (
                        <div>
                          <p className="font-semibold mt-2">제출 서류 및 전형 절차:</p>
                          <ul className="list-disc list-inside ml-4 text-muted-foreground">
                            {jobData.applicationProcess.map((proc: string, procIdx: number) => (
                              <li key={procIdx}>{proc}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {jobData.notes && (
                        <p className="font-semibold mt-2">비고: {jobData.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : selectedItem && (
              <p className="text-muted-foreground mt-4">
                이 회사에 대한 관련 채용공고 분석 데이터가 없습니다.
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            이 데이터는 JSON 파일에서 로드되었습니다.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

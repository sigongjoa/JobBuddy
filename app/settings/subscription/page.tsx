'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function SubscriptionPage() {
  console.debug("SubscriptionPage: function entry");
  const [currentPlan, setCurrentPlan] = useState("Basic Plan");
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const [nextBillingDate, setNextBillingDate] = useState("2024년 7월 30일");

  const handleUpgradePlan = () => {
    console.debug("handleUpgradePlan: function entry");
    alert("요금제 업그레이드 기능은 아직 구현되지 않았습니다.");
    console.debug("handleUpgradePlan: function exit");
  };

  const handleCancelSubscription = () => {
    console.debug("handleCancelSubscription: function entry");
    if (confirm("정말로 구독을 취소하시겠습니까?")) {
      alert("구독이 취소되었습니다. (실제 기능 미구현)");
      // 실제 구독 취소 로직은 여기에 들어갑니다.
    }
    console.debug("handleCancelSubscription: function exit");
  };

  console.debug("SubscriptionPage: function exit");

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">구독 관리</CardTitle>
          <CardDescription className="text-center">현재 구독 정보를 확인하고 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPlan" className="text-lg font-semibold">현재 요금제</Label>
              <Input id="currentPlan" value={currentPlan} readOnly className="mt-1" />
            </div>
            <div>
              <Label htmlFor="billingCycle" className="text-lg font-semibold">결제 주기</Label>
              <Input id="billingCycle" value={billingCycle} readOnly className="mt-1" />
            </div>
            <div>
              <Label htmlFor="nextBillingDate" className="text-lg font-semibold">다음 결제일</Label>
              <Input id="nextBillingDate" value={nextBillingDate} readOnly className="mt-1" />
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">요금제 변경</h3>
            <p className="text-muted-foreground">더 높은 요금제로 업그레이드하여 추가 기능을 이용하세요.</p>
            <Button onClick={handleUpgradePlan} className="w-full">요금제 업그레이드</Button>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-red-600">구독 취소</h3>
            <p className="text-muted-foreground">구독을 취소하면 현재 결제 주기가 끝난 후 서비스에 액세스할 수 없게 됩니다.</p>
            <Button variant="destructive" onClick={handleCancelSubscription} className="w-full">구독 취소</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
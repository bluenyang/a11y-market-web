// components/order/OrderFilterBar.jsx

import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export default function OrderFilterBar({
    statusFilter,
    setStatusFilter,
    sortType,
    setSortType,
    searchKeyword,
    SetSearchKeyword,
    startDate,
    SetStartDate,
    endDate,
    setEndDate,
}) {
    return (
        <Card>
            <CardContent className='space-y-6' py-6>
                {}
            </CardContent>
        </Card>
    )
}
# SHG Portal -- Master Development Prompt

## Role

You are a senior full-stack architect and developer helping build a
production-ready **Self Help Group (SHG) Portal**.

The application must remain **simple**, **maintainable**, and
**feature-first**.

Never redesign the architecture. Continue from the current
implementation.

------------------------------------------------------------------------

# Technology Stack (LOCKED)

-   Next.js 16 (App Router)
-   React 19
-   TypeScript (Strict)
-   MongoDB
-   Mongoose 8
-   Auth.js v5
-   Material UI v7
-   Zod

Never replace any technology.

------------------------------------------------------------------------

# Architecture (LOCKED)

Use:

-   Domain Driven Design (DDD)
-   Feature First Architecture
-   Vertical Slice Development

Avoid:

-   Repository Pattern
-   DTO Layer
-   Mapper Layer
-   Generic Base Classes
-   Framework-style abstractions
-   Unnecessary helper libraries

This is a **simple application**, not a framework.

------------------------------------------------------------------------

# Folder Structure

``` text
src/
├── app/
├── features/
├── models/
├── lib/
└── scripts/
```

Meeting feature:

``` text
features/
└── meetings/
    ├── domain/
    ├── services/
    ├── ui/
    ├── validation.ts
    └── types.ts
```

------------------------------------------------------------------------

# Development Order

Always implement features in this order:

1.  Domain
2.  Model
3.  Validation
4.  Types
5.  Services
6.  API
7.  UI
8.  Page
9.  Integration
10. Stabilization

Every batch must leave the application compilable.

------------------------------------------------------------------------

# UI Rules

-   Mobile First
-   Responsive
-   Material UI
-   Server Components wherever possible
-   Client Components only for interactivity
-   No business logic inside UI

Business rules belong only inside services.

------------------------------------------------------------------------

# Validation Rules

-   Always use Zod.
-   Never validate inside UI.
-   Never validate inside API.
-   APIs simply call services.

------------------------------------------------------------------------

# Service Rules

Every service follows:

1.  connectMongo()
2.  Validate
3.  Business Rules
4.  Database
5.  Return plain objects

Never return Mongoose documents.

------------------------------------------------------------------------

# Coding Rules

Always generate:

-   Complete file
-   Full path
-   All imports
-   Strict typing

No placeholders.

------------------------------------------------------------------------

# Response Style

When generating code:

1.  Show file path.
2.  Generate the complete file.

Avoid partial snippets unless explicitly requested.

------------------------------------------------------------------------

# Current Goals


1.  Begin subsequent SHG modules 

------------------------------------------------------------------------

# General Principles

-   Keep the architecture simple.
-   Maintain feature-first organization.
-   Keep business logic in services.
-   Reuse existing patterns.
-   Prefer consistency over clever abstractions.
-   Every batch must leave the project compiling and runnable.

# Exisitng Schema:
import{InferSchemaType,Model,Schema,Types,model,models,}from "mongoose";import{createSchema}from "@/lib/db/schema";const financialYearSchema=createSchema({name:{type:String,required:true,unique:true,trim:true,maxlength:100,},startDate:{type:Date,required:true,},endDate:{type:Date,required:true,},remarks:{type:String,default:"",trim:true,maxlength:1000,},status:{type:String,enum:["DRAFT","IN_PROGRESS","VALIDATED","APPROVED","CLOSED",],default:"DRAFT",index:true,},members:[{memberId:{type:Schema.Types.ObjectId,ref:"Member",required:true,},opening:{contribution:{type:Number,default:0,min:0,},loan:{type:Number,default:0,min:0,},specialLoan:{type:Number,default:0,min:0,},specialLoanExpiry:{type:Date,default:null,},},},],executiveCommittee:{president:{type:Schema.Types.ObjectId,ref:"Member",default:null,},vicePresident:{type:Schema.Types.ObjectId,ref:"Member",default:null,},secretary:{type:Schema.Types.ObjectId,ref:"Member",default:null,},jointSecretary:{type:Schema.Types.ObjectId,ref:"Member",default:null,},treasurer:{type:Schema.Types.ObjectId,ref:"Member",default:null,},},openingBalances:{bankBalance:{type:Number,default:0,min:0,},cashInHand:{type:Number,default:0,min:0,},excessCorpus:{type:Number,default:0,min:0,},investments:{type:Number,default:0,min:0,},otherLoans:{type:Number,default:0,min:0,},},});financialYearSchema.index({name:1},{unique:true},);financialYearSchema.index({startDate:1,endDate:1,});financialYearSchema.index({status:1,});financialYearSchema.index({status:1},{unique:true,partialFilterExpression:{status:"IN_PROGRESS",},},);export type FinancialYearDocument=InferSchemaType<typeof financialYearSchema>&{_id:Types.ObjectId;};export type FinancialYearStatus=|"DRAFT"|"IN_PROGRESS"|"VALIDATED"|"APPROVED"|"CLOSED";const FinancialYear:Model<FinancialYearDocument>=(models.FinancialYear as Model<FinancialYearDocument>)??model<FinancialYearDocument>("FinancialYear",financialYearSchema,);export default FinancialYear;export{FinancialYear};

import{InferSchemaType,Model,Schema,Types,model,models,}from 'mongoose';import{createSchema}from '@/lib/db/schema';import{USER_ROLES,USER_ROLE_VALUES,}from '@/lib/constants/roles';import{USER_STATUS,USER_STATUS_VALUES,}from '@/lib/constants/user-status';const userSchema=createSchema({username:{type:String,required:true,unique:true,trim:true,lowercase:true,minlength:3,maxlength:50,},passwordHash:{type:String,required:true,minlength:60,maxlength:255,},role:{type:String,enum:USER_ROLE_VALUES,default:USER_ROLES.MEMBER,required:true,},status:{type:String,enum:USER_STATUS_VALUES,default:USER_STATUS.ACTIVE,required:true,},memberId:{type:Schema.Types.ObjectId,ref:'Member',default:null,},lastLoginAt:{type:Date,default:null,},});userSchema.index({username:1,},{unique:true,},);userSchema.index({memberId:1,});userSchema.index({role:1,});userSchema.index({status:1,});export type UserDocument=InferSchemaType<typeof userSchema>&{_id:Types.ObjectId;};const User:Model<UserDocument>=(models.User as Model<UserDocument>)??model<UserDocument>('User',userSchema);export default User;export{User};

import{InferSchemaType,Model,Types,model,models,}from 'mongoose';import{createSchema}from '@/lib/db/schema';const memberSchema=createSchema({memberCode:{type:String,required:true,trim:true,uppercase:true,minlength:1,maxlength:20,},name:{type:String,required:true,trim:true,minlength:2,maxlength:150,},phone:{type:String,required:true,trim:true,minlength:10,maxlength:15,},address:{type:String,default:'',trim:true,maxlength:500,},joinDate:{type:Date,required:true,default:Date.now,},active:{type:Boolean,default:true,required:true,},remarks:{type:String,default:'',trim:true,maxlength:1000,},userId:{type:Types.ObjectId,ref:'User',required:true,unique:true,},});memberSchema.index({memberCode:1,},{unique:true,},);memberSchema.index({phone:1,},{unique:true,},);memberSchema.index({active:1,});memberSchema.index({name:1,});memberSchema.index({joinDate:1,});export type MemberDocument=InferSchemaType<typeof memberSchema>&{_id:Types.ObjectId;};const Member:Model<MemberDocument>=(models.Member as Model<MemberDocument>)??model<MemberDocument>('Member',memberSchema);export default Member;export{Member};

import{InferSchemaType,Model,Schema,Types,model,models,}from "mongoose";import{createSchema}from "@/lib/db/schema";import{MEETING_STATUS,MEETING_STATUS_VALUES,}from "@/features/meetings/domain/meeting-status";import{ATTENDANCE_STATUS,ATTENDANCE_STATUS_VALUES,}from "@/features/meetings/domain/attendance-status";import{WEEKLY_CONTRIBUTION,}from "@/features/meetings/domain/payment";import{BANK_TRANSACTION_TYPE,BANK_TRANSACTION_TYPE_VALUES,}from "@/features/meetings/domain/bank-transaction";import{INCOME_CATEGORY,INCOME_CATEGORY_VALUES,}from "@/features/meetings/domain/income";import{EXPENSE_CATEGORY,EXPENSE_CATEGORY_VALUES,}from "@/features/meetings/domain/expense";const incomeSchema=createSchema({transactionDate:{type:Date,required:true,},category:{type:String,enum:INCOME_CATEGORY_VALUES,required:true,default:INCOME_CATEGORY.MISCELLANEOUS,},amount:{type:Number,required:true,min:0,},remarks:{type:String,default:"",trim:true,maxlength:500,},},{_id:false,},);const expenseSchema=createSchema({transactionDate:{type:Date,required:true,},category:{type:String,enum:EXPENSE_CATEGORY_VALUES,required:true,default:EXPENSE_CATEGORY.MISCELLANEOUS,},amount:{type:Number,required:true,min:0,},remarks:{type:String,default:"",trim:true,maxlength:500,},},{_id:false,},);const meetingSchema=createSchema({financialYearId:{type:Schema.Types.ObjectId,ref:"FinancialYear",required:true,index:true,},meetingDate:{type:Date,required:true,index:true,},place:{type:String,required:true,trim:true,maxlength:150,},agenda:{type:String,default:"",trim:true,maxlength:1000,},remarks:{type:String,default:"",trim:true,maxlength:2000,},attendance:[{memberId:{type:Schema.Types.ObjectId,ref:"Member",required:true,},status:{type:String,enum:ATTENDANCE_STATUS_VALUES,default:ATTENDANCE_STATUS.PRESENT,required:true,},remarks:{type:String,default:"",trim:true,maxlength:500,},},],payments:{type:[{memberId:{type:Schema.Types.ObjectId,ref:"Member",required:true,},contribution:{type:Number,default:0,min:0,required:true,},loanRepayment:{type:Number,default:0,min:0,required:true,},absentFine:{type:Number,default:0,min:0,required:true,},specialLoanFine:{type:Number,default:0,min:0,required:true,},remarks:{type:String,default:"",trim:true,maxlength:500,},},],default:[],},bankTransactions:{type:[{transactionDate:{type:Date,required:true,},type:{type:String,enum:BANK_TRANSACTION_TYPE_VALUES,required:true,default:BANK_TRANSACTION_TYPE.DEPOSIT,},amount:{type:Number,required:true,min:0,},remarks:{type:String,default:"",trim:true,maxlength:500,},},],default:[],},otherIncomes:{type:[incomeSchema],default:[],},expenses:{type:[expenseSchema],default:[],},status:{type:String,enum:MEETING_STATUS_VALUES,default:MEETING_STATUS.DRAFT,required:true,index:true,},startedAt:{type:Date,default:null,},approvedAt:{type:Date,default:null,},closedAt:{type:Date,default:null,},createdBy:{type:Types.ObjectId,ref:"User",default:null,},updatedBy:{type:Types.ObjectId,ref:"User",default:null,},});meetingSchema.index({financialYearId:1,meetingDate:1,},{unique:true,});meetingSchema.index({status:1,meetingDate:-1,});meetingSchema.index({"attendance.memberId":1,});meetingSchema.index({"payments.memberId":1,});meetingSchema.index({"bankTransactions.transactionDate":1,});meetingSchema.index({"otherIncomes.transactionDate":1,});meetingSchema.index({"expenses.transactionDate":1,});export type MeetingDocument=InferSchemaType<typeof meetingSchema>&{_id:Types.ObjectId;};const Meeting:Model<MeetingDocument>=(models.Meeting as Model<MeetingDocument>)??model<MeetingDocument>("Meeting",meetingSchema);export default Meeting;export{Meeting};

------------------------------------------------------------------------

# Next Action:

Prepare a loan book memberwise, so each members can see their loan staus, repayments, fine, outstanding amount etc

Summary will have these values -  Loan Disbursed amount, Start Date, EMI, Outstanding Principal, Paid Interest, Pending Interest, Pain Loan Fine, Pending Loan Fine, Total to be paid (including all amount)

Loan book should have below fields
1. Date
2. Amount Paid
3. Loan Fine
4. Interest Cauculated Days (cauculate from previous interest date)
5. Interest (cauculate from previous interest date)
6. Paid Interest
7. Paid Loan FIne
8. Paid Principle
9. Pending Interest
10. Pending Loan FIne
11. Balance Principle

Each member will have one or more loans in a financial year, but only one active at a time. All loans will be listed in loan page. We can filter by memeber and clicking on detail will see the loan passbook. CLose option will be there on loan when all amounts are paid.

The interest will be calculated dailywise, and the interest will be calculated when loan repayment done. Monthly a minimum 800 repayment is expected for a 1000 to 25000 loan amount, if amount is 25001 to 50k, then minimum payment will be 1600. for 50001 to 75k, min amount is 2400 for 75001 to 1 lakh.

Loan fine 100 will be charged on each month when minimum expected loan amount is not payed in that month. If a person have loan fine, next month he has to pay all loan fines and the minimum amount to avoid loan fine. The loan fine of a month is calculaed on first dat of next month, interest also calculated with this entry.

10% interest is charged for loan amount, and its calculated in diminishing way. The interest is charged to current outstanding priciple, pending loan fine or pending interest wil not be added to principle for interest calculation.

In summary mention the actual percentage of interest changed to loan in non-diminishing way.
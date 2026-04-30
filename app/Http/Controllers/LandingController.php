<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class LandingController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('Home', [

            'stats' => [
                [
                    'icon'  => 'bi-people',
                    'value' => '1000+',
                    'label' => [
                        'en' => 'Clients Served',
                        'ar' => 'عملاء تم خدمتهم',
                    ],
                ],
                [
                    'icon'  => 'bi-award',
                    'value' => '98%',
                    'label' => [
                        'en' => 'Success Rate',
                        'ar' => 'نسبة النجاح',
                    ],
                ],
                [
                    'icon'  => 'bi-clock',
                    'value' => '17+',
                    'label' => [
                        'en' => 'Years Experience',
                        'ar' => 'سنوات خبرة',
                    ],
                ],
                [
                    'icon'  => 'bi-journal',
                    'value' => '10+',
                    'label' => [
                        'en' => 'Practice Areas',
                        'ar' => 'مجالات ممارسة',
                    ],
                ],
            ],

            'metrics' => [
                [
                    'icon'  => 'bi-bullseye',
                    'value' => '98%',
                    'label' => [
                        'en' => 'Case Success Rate',
                        'ar' => 'نسبة نجاح القضايا',
                    ],
                    'desc'  => [
                        'en' => 'Consistently high success rate across all practice areas',
                        'ar' => 'نسبة نجاح عالية باستمرار في جميع مجالات الممارسة',
                    ],
                ],
                [
                    'icon'  => 'bi-people',
                    'value' => '1000+',
                    'label' => [
                        'en' => 'Satisfied Clients',
                        'ar' => 'عملاء راضون',
                    ],
                    'desc'  => [
                        'en' => 'Clients served across Dubai and Abu Dhabi since 2010',
                        'ar' => 'عملاء تم خدمتهم في دبي وأبوظبي منذ عام 2010',
                    ],
                ],
                [
                    'icon'  => 'bi-patch-check',
                    'value' => '17+',
                    'label' => [
                        'en' => 'Years Experience',
                        'ar' => 'سنوات خبرة',
                    ],
                    'desc'  => [
                        'en' => 'Combined decades of legal expertise in UAE law',
                        'ar' => 'عقود من الخبرة القانونية في قوانين دولة الإمارات',
                    ],
                ],
                [
                    'icon'  => 'bi-headset',
                    'value' => '24/7',
                    'label' => [
                        'en' => 'Client Support',
                        'ar' => 'دعم العملاء',
                    ],
                    'desc'  => [
                        'en' => 'Round-the-clock legal consultation and emergency services',
                        'ar' => 'استشارات قانونية وخدمات طارئة على مدار الساعة',
                    ],
                ],
            ],

            'certs' => [
                [
                    'icon'  => 'bi-badge-ad',
                    'title' => [
                        'en' => 'UAE Bar Association Membership',
                        'ar' => 'عضوية جمعية المحامين الإماراتية',
                    ],
                    'desc'  => [
                        'en' => 'Licensed to practice law in all UAE courts and jurisdictions',
                        'ar' => 'مرخص لمزاولة المحاماة أمام جميع محاكم دولة الإمارات',
                    ],
                ],
                [
                    'icon'  => 'bi-building',
                    'title' => [
                        'en' => 'DIFC Courts Registration',
                        'ar' => 'التسجيل لدى محاكم مركز دبي المالي العالمي',
                    ],
                    'desc'  => [
                        'en' => 'Authorized to represent clients in DIFC court proceedings',
                        'ar' => 'مخول لتمثيل العملاء أمام محاكم مركز دبي المالي العالمي',
                    ],
                ],
                [
                    'icon'  => 'bi-bank',
                    'title' => [
                        'en' => 'ADGM Registration',
                        'ar' => 'التسجيل لدى سوق أبوظبي العالمي',
                    ],
                    'desc'  => [
                        'en' => 'Qualified to handle legal matters within ADGM jurisdiction',
                        'ar' => 'مؤهل للتعامل مع القضايا القانونية ضمن نطاق سوق أبوظبي العالمي',
                    ],
                ],
                [
                    'icon'  => 'bi-shield-check',
                    'title' => [
                        'en' => 'ISO 9001:2015 Quality Management',
                        'ar' => 'شهادة ISO 9001:2015 لإدارة الجودة',
                    ],
                    'desc'  => [
                        'en' => 'Certified for quality management systems in legal services',
                        'ar' => 'معتمد لأنظمة إدارة الجودة في الخدمات القانونية',
                    ],
                ],
            ],

            'timeline' => [
                [
                    'year'  => 2007,
                    'title' => [
                        'en' => 'Established in Dubai',
                        'ar' => 'تأسيس المكتب في دبي',
                    ],
                    'desc'  => [
                        'en' => 'Firm established with a vision to provide comprehensive legal services',
                        'ar' => 'تأسيس المكتب برؤية لتقديم خدمات قانونية شاملة',
                    ],
                ],
                [
                    'year'  => 2012,
                    'title' => [
                        'en' => 'Arbitration',
                        'ar' => 'التحكيم',
                    ],
                    'desc'  => [
                        'en' => 'Developed specialist ADR capabilities',
                        'ar' => 'تطوير قدرات متخصصة في الوسائل البديلة لحل النزاعات',
                    ],
                ],
                [
                    'year'  => 2016,
                    'title' => [
                        'en' => 'Abu Dhabi Office',
                        'ar' => 'افتتاح مكتب أبوظبي',
                    ],
                    'desc'  => [
                        'en' => 'Expanded operations to serve clients in the capital',
                        'ar' => 'توسيع العمليات لخدمة العملاء في العاصمة',
                    ],
                ],
                [
                    'year'  => 2022,
                    'title' => [
                        'en' => 'SCA Licenses',
                        'ar' => 'تراخيص هيئة الأوراق المالية والسلع',
                    ],
                    'desc'  => [
                        'en' => 'Permits to conduct regulated financial activities in the UAE',
                        'ar' => 'تصاريح لمزاولة أنشطة مالية منظمة في دولة الإمارات',
                    ],
                ],
                [
                    'year'  => 2023,
                    'title' => [
                        'en' => 'Legal Consultations',
                        'ar' => 'الاستشارات القانونية',
                    ],
                    'desc'  => [
                        'en' => 'Introduced monthly legal consultation subscriptions for companies',
                        'ar' => 'إطلاق اشتراكات شهرية للاستشارات القانونية للشركات',
                    ],
                ],
                [
                    'year'  => 2024,
                    'title' => [
                        'en' => 'AML / CTF Compliance',
                        'ar' => 'الامتثال لمكافحة غسل الأموال وتمويل الإرهاب',
                    ],
                    'desc'  => [
                        'en' => 'Introduced AML, CFT and compliance services with staff training',
                        'ar' => 'تقديم خدمات الامتثال ومكافحة غسل الأموال مع تدريب الموظفين',
                    ],
                ],
                [
                    'year'  => 'Today',
                    'title' => [
                        'en' => 'Full-service Offering',
                        'ar' => 'خدمات قانونية متكاملة',
                    ],
                    'desc'  => [
                        'en' => 'Corporate governance, restructuring, arbitration, family business, and cross-border consultations across the Arab region and Europe',
                        'ar' => 'حوكمة الشركات، إعادة الهيكلة، التحكيم، الشركات العائلية، والاستشارات العابرة للحدود في المنطقة العربية وأوروبا',
                    ],
                ],
            ],

            'awards' => [
                [
                    'badge' => 'Excellence',
                    'title' => [
                        'en' => 'UAE Legal Excellence Award',
                        'ar' => 'جائزة التميز القانوني في الإمارات',
                    ],
                    'year' => 2023,
                    'org'  => [
                        'en' => 'UAE Bar Association',
                        'ar' => 'جمعية المحامين الإماراتية',
                    ],
                    'desc' => [
                        'en' => 'Outstanding legal service & client satisfaction',
                        'ar' => 'تميز في الخدمة القانونية ورضا العملاء',
                    ],
                ],
                [
                    'badge' => 'Corporate',
                    'title' => [
                        'en' => 'Best Corporate Law Firm',
                        'ar' => 'أفضل مكتب قانون شركات',
                    ],
                    'year' => 2022,
                    'org'  => [
                        'en' => 'Middle East Legal Awards',
                        'ar' => 'جوائز الشرق الأوسط القانونية',
                    ],
                    'desc' => [
                        'en' => 'Exceptional corporate law practice',
                        'ar' => 'تميز في ممارسة قانون الشركات',
                    ],
                ],
                [
                    'badge' => 'Client Service',
                    'title' => [
                        'en' => 'Client Choice Award',
                        'ar' => 'جائزة اختيار العملاء',
                    ],
                    'year' => 2023,
                    'org'  => [
                        'en' => 'Legal Services Review',
                        'ar' => 'مراجعة الخدمات القانونية',
                    ],
                    'desc' => [
                        'en' => 'Most trusted firm for real estate & employment law',
                        'ar' => 'المكتب الأكثر ثقة في قضايا العقارات وقانون العمل',
                    ],
                ],
            ],
        ]);
    }
}

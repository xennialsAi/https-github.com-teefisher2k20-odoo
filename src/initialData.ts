import { ResPartner, ProductProduct, CrmLead, SaleOrder, AccountInvoice, StockMove, CustomOdooAddon } from './types';

export const INITIAL_PARTNERS: ResPartner[] = [
  {
    id: 'res_partner_1',
    name: 'Mitchell Admin',
    email: 'admin@yourcompany.example.com',
    phone: '+1 555-0100',
    city: 'San Francisco',
    country: 'United States',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&q=80',
  },
  {
    id: 'res_partner_2',
    name: 'Deco Addict',
    email: 'info@decoaddict.example.com',
    phone: '+1 555-0199',
    city: 'Los Angeles',
    country: 'United States',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&fit=crop&q=80',
  },
  {
    id: 'res_partner_3',
    name: 'Azure Interior',
    email: 'contact@azure.example.com',
    phone: '+32 81 81 37 00',
    city: 'Brussels',
    country: 'Belgium',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&fit=crop&q=80',
  },
  {
    id: 'res_partner_4',
    name: 'Gemini Space Corp',
    email: 'procurement@geminispace.example.com',
    phone: '+1 415-555-0131',
    city: 'Mountain View',
    country: 'United States',
    image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&fit=crop&q=80',
  },
  {
    id: 'res_partner_5',
    name: 'Ready Mat',
    email: 'sales@readymat.example.com',
    phone: '+1 212-555-0144',
    city: 'New York',
    country: 'United States',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&fit=crop&q=80',
  }
];

export const INITIAL_PRODUCTS: ProductProduct[] = [
  {
    id: 'product_1',
    name: 'Custom Corner Desk',
    list_price: 750.00,
    standard_price: 450.00,
    qty_available: 12,
    image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=150&fit=crop&q=80',
    description: 'Custom engineered high-density fiberboard office desk.'
  },
  {
    id: 'product_2',
    name: 'Ergonomic Conference Chair',
    list_price: 150.00,
    standard_price: 90.00,
    qty_available: 35,
    image_url: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=150&fit=crop&q=80',
    description: 'Pneumatic height adjustment and durable lumbar support mesh.'
  },
  {
    id: 'product_3',
    name: 'Acoustic Absorption Panel',
    list_price: 45.00,
    standard_price: 20.00,
    qty_available: 120,
    image_url: 'https://images.unsplash.com/photo-1598112972234-5415c3ec2905?w=150&fit=crop&q=80',
    description: 'Noise cancelling textile-wrapped architectural acoustics asset.'
  },
  {
    id: 'product_4',
    name: 'Modular Storage Cabinet',
    list_price: 280.00,
    standard_price: 180.00,
    qty_available: 8,
    image_url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=150&fit=crop&q=80',
    description: 'Spacious four-shelf lockable wooden storage unit.'
  }
];

export const INITIAL_LEADS: CrmLead[] = [
  {
    id: 'crm_lead_1',
    name: 'Desk Upgrades for Engineering Team',
    partner_id: 'res_partner_2', // Deco Addict
    expected_revenue: 7500.00,
    probability: 45,
    stage_id: 'qualified',
    email: 'info@decoaddict.example.com',
    phone: '+1 555-0199',
    description: 'They need dynamic sit-to-stand options or heavy-duty desks for their new designers.',
    priority: 2,
    date_deadline: '2026-06-15'
  },
  {
    id: 'crm_lead_2',
    name: 'Boardroom Refurbishment Chair Package',
    partner_id: 'res_partner_1', // Mitchell Admin
    expected_revenue: 5250.00,
    probability: 70,
    stage_id: 'proposition',
    email: 'admin@yourcompany.example.com',
    phone: '+1 555-0100',
    description: ' Mitchell requested standard pricing for 35 executive grade mesh-back custom conference chairs.',
    priority: 3,
    date_deadline: '2026-06-01'
  },
  {
    id: 'crm_lead_3',
    name: 'HQ Acoustical Treatment Project',
    partner_id: 'res_partner_4', // Gemini Space Corp
    expected_revenue: 45000.00,
    probability: 100,
    stage_id: 'won',
    email: 'procurement@geminispace.example.com',
    phone: '+1 415-555-0131',
    description: 'Signed agreement to outfit the new audio recording suite with a full wall array of sound insulation modules.',
    priority: 3,
    date_deadline: '2026-05-18'
  },
  {
    id: 'crm_lead_4',
    name: 'Secondary Lobby Cabinet Accessories',
    partner_id: 'res_partner_3', // Azure Interior
    expected_revenue: 1120.00,
    probability: 15,
    stage_id: 'new',
    email: 'contact@azure.example.com',
    phone: '+32 81 81 37 00',
    description: 'Prospecting stage. Inquiry received through custom Odoo contact form.',
    priority: 1,
    date_deadline: '2026-07-20'
  }
];

export const INITIAL_SALES: SaleOrder[] = [
  {
    id: 'sale_order_1',
    name: 'SO001',
    partner_id: 'res_partner_5', // Ready Mat
    date_order: '2026-05-19',
    state: 'draft',
    amount_untaxed: 1500.00,
    amount_tax: 225.00,
    amount_total: 1725.00,
    order_line: [
      {
        id: 'sol_1',
        product_id: 'product_2', // Ergonomic Conference Chair
        product_uom_qty: 10,
        price_unit: 150.00,
        price_subtotal: 1500.00
      }
    ]
  },
  {
    id: 'sale_order_2',
    name: 'SO002',
    partner_id: 'res_partner_2', // Deco Addict
    date_order: '2026-05-20',
    state: 'sale',
    amount_untaxed: 2900.00,
    amount_tax: 435.00,
    amount_total: 3335.00,
    order_line: [
      {
        id: 'sol_2',
        product_id: 'product_1', // Custom Corner Desk
        product_uom_qty: 2,
        price_unit: 750.00,
        price_subtotal: 1500.00
      },
      {
        id: 'sol_3',
        product_id: 'product_4', // Modular Storage Cabinet
        product_uom_qty: 5,
        price_unit: 280.00,
        price_subtotal: 1400.00
      }
    ]
  }
];

export const INITIAL_INVOICES: AccountInvoice[] = [
  {
    id: 'account_invoice_1',
    name: 'INV/2026/0001',
    partner_id: 'res_partner_2', // Deco Addict
    invoice_date: '2026-05-20',
    state: 'posted',
    payment_state: 'paid',
    amount_untaxed: 2900.00,
    amount_tax: 435.00,
    amount_total: 3335.00,
    invoice_line: [
      {
        id: 'ail_1',
        product_id: 'product_1',
        product_uom_qty: 2,
        price_unit: 750.00,
        price_subtotal: 1500.00
      },
      {
        id: 'ail_2',
        product_id: 'product_4',
        product_uom_qty: 5,
        price_unit: 280.00,
        price_subtotal: 1400.00
      }
    ]
  }
];

export const INITIAL_STOCK_MOVES: StockMove[] = [
  {
    id: 'move_1',
    reference: 'WH/IN/0001',
    product_id: 'product_1',
    qty: 12,
    type: 'in',
    date: '2026-05-10',
    state: 'done'
  },
  {
    id: 'move_2',
    reference: 'WH/IN/0002',
    product_id: 'product_2',
    qty: 35,
    type: 'in',
    date: '2026-05-11',
    state: 'done'
  },
  {
    id: 'move_3',
    reference: 'WH/IN/0003',
    product_id: 'product_3',
    qty: 120,
    type: 'in',
    date: '2026-05-12',
    state: 'done'
  },
  {
    id: 'move_4',
    reference: 'WH/IN/0004',
    product_id: 'product_4',
    qty: 8,
    type: 'in',
    date: '2026-05-13',
    state: 'done'
  }
];

export const INITIAL_ADDONS: CustomOdooAddon[] = [
  {
    id: 'addon_school',
    name: 'school_registry',
    shortdesc: 'School Registry',
    description: 'Provides tracking of active students, enrollment details, grades, GPA score indexes, and classroom allocation tables using native python-driven data schemas.',
    author: 'Odoo S.A.',
    icon: 'GraduationCap',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields, api

class SchoolStudent(models.Model):
    _name = "school.student"
    _description = "Student Profile"

    name = fields.Char(string="Student Name", required=True)
    age = fields.Integer(string="Age")
    grade = fields.Float(string="GPA Score")
    enrolled = fields.Boolean(string="Enrolled", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Student Registry">
        <field name="name"/>
        <field name="age"/>
        <field name="grade"/>
        <field name="enrolled"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_estate',
    name: 'estate_management',
    shortdesc: 'Real Estate Management',
    description: 'Track master property sales listings, expected prices versus sold prices, number of bathrooms/bedrooms, and listing availability dates.',
    author: 'Odoo S.A.',
    icon: 'Home',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class EstateProperty(models.Model):
    _name = "estate.property"
    _description = "Real Estate Listing"

    name = fields.Char(string="Title", required=True)
    description = fields.Char(string="Type")
    expected_price = fields.Integer(string="Asking Price ($)")
    bedrooms = fields.Integer(string="Bedrooms Required")
    active = fields.Boolean(string="Fully Active", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Real Estate Directory">
        <field name="name"/>
        <field name="description"/>
        <field name="expected_price"/>
        <field name="bedrooms"/>
        <field name="active"/>
    </tree>
</odoo>`
  }
];
